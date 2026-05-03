import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
} from "axios";
import { api, API_BASE_URL, API_ENDPOINTS } from "./api";
import { getAccessToken, getRefreshToken, setTokens } from "../utils/auth";

const ok =
  (data: unknown): AxiosAdapter =>
  async (config) =>
    ({
      data,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    }) as AxiosResponse;

const unauthorized = (): AxiosAdapter => async (config) => {
  const response = {
    data: { detail: "expired" },
    status: 401,
    statusText: "Unauthorized",
    headers: new AxiosHeaders(),
    config,
  } as AxiosResponse;
  throw new AxiosError(
    "Request failed with status code 401",
    AxiosError.ERR_BAD_REQUEST,
    config,
    undefined,
    response,
  );
};

describe("api response interceptor (refresh on 401)", () => {
  let adapter: ReturnType<typeof vi.fn>;
  let postSpy: import("vitest").MockInstance<typeof axios.post>;
  const originalAdapter = api.defaults.adapter;
  const originalLocation = window.location;

  beforeEach(() => {
    localStorage.clear();
    setTokens("old-access", "valid-refresh");

    adapter = vi.fn();
    api.defaults.adapter = adapter as AxiosAdapter;
    postSpy = vi.spyOn(axios, "post");

    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: { pathname: "/dashboard", href: "" },
    });
  });

  afterEach(() => {
    api.defaults.adapter = originalAdapter;
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: originalLocation,
    });
    vi.restoreAllMocks();
  });

  it("refreshes tokens and replays the original request on 401", async () => {
    adapter
      .mockImplementationOnce(unauthorized())
      .mockImplementationOnce(ok({ id: 1 }));
    postSpy.mockResolvedValueOnce({
      data: { access: "new-access", refresh: "new-refresh" },
    });

    const res = await api.get(API_ENDPOINTS.me);

    expect(res.data).toEqual({ id: 1 });
    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(postSpy).toHaveBeenCalledWith(
      `${API_BASE_URL}${API_ENDPOINTS.refresh}`,
      { refresh: "valid-refresh" },
    );
    expect(getAccessToken()).toBe("new-access");
    expect(getRefreshToken()).toBe("new-refresh");
    expect(adapter).toHaveBeenCalledTimes(2);
    expect(adapter.mock.calls[1][0].headers.Authorization).toBe(
      "Bearer new-access",
    );
  });

  it("keeps the previous refresh token when the backend does not rotate it", async () => {
    adapter
      .mockImplementationOnce(unauthorized())
      .mockImplementationOnce(ok({ id: 1 }));
    postSpy.mockResolvedValueOnce({ data: { access: "new-access" } });

    await api.get(API_ENDPOINTS.me);

    expect(getAccessToken()).toBe("new-access");
    expect(getRefreshToken()).toBe("valid-refresh");
  });

  it("clears tokens and redirects to /login when the refresh fails", async () => {
    adapter.mockImplementationOnce(unauthorized());
    postSpy.mockRejectedValueOnce(new Error("refresh expired"));

    await expect(api.get(API_ENDPOINTS.me)).rejects.toThrow();

    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(window.location.href).toBe("/login");
  });

  it("does not call refresh when no refresh token is stored", async () => {
    localStorage.removeItem("weeb_refresh_token");
    adapter.mockImplementationOnce(unauthorized());

    await expect(api.get(API_ENDPOINTS.me)).rejects.toThrow();

    expect(postSpy).not.toHaveBeenCalled();
    expect(adapter).toHaveBeenCalledTimes(1);
  });

  it("shares a single refresh call across concurrent 401s", async () => {
    adapter
      .mockImplementationOnce(unauthorized())
      .mockImplementationOnce(unauthorized())
      .mockImplementationOnce(ok({ a: 1 }))
      .mockImplementationOnce(ok({ b: 2 }));

    let resolveRefresh!: (value: { data: { access: string } }) => void;
    postSpy.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRefresh = resolve;
      }),
    );

    const p1 = api.get(API_ENDPOINTS.me);
    const p2 = api.get(API_ENDPOINTS.posts);

    await new Promise((r) => setTimeout(r, 0));
    resolveRefresh({ data: { access: "shared-access" } });

    const [r1, r2] = await Promise.all([p1, p2]);

    expect(r1.data).toEqual({ a: 1 });
    expect(r2.data).toEqual({ b: 2 });
    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(getAccessToken()).toBe("shared-access");
  });

  it("does not loop when the retried request also returns 401", async () => {
    adapter
      .mockImplementationOnce(unauthorized())
      .mockImplementationOnce(unauthorized());
    postSpy.mockResolvedValueOnce({ data: { access: "new-access" } });

    await expect(api.get(API_ENDPOINTS.me)).rejects.toThrow();

    expect(adapter).toHaveBeenCalledTimes(2);
    expect(postSpy).toHaveBeenCalledTimes(1);
  });
});
