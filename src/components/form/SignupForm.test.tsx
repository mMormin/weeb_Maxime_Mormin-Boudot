import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { AxiosError, AxiosHeaders } from "axios";
import SignupForm from "./SignupForm";
import { api, API_ENDPOINTS } from "../../config/api";

vi.mock("../../config/api", () => ({
  api: { post: vi.fn() },
  API_ENDPOINTS: { register: "/api/users/create/", login: "/api/token/" },
}));

const renderSignupForm = () =>
  render(
    <MemoryRouter>
      <SignupForm />
    </MemoryRouter>
  );

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByPlaceholderText("Email"), "newbie@example.fr");
  await user.type(
    screen.getByPlaceholderText("Mot de passe"),
    "password123"
  );
  await user.type(
    screen.getByPlaceholderText("Confirmer le mot de passe"),
    "password123"
  );
};

// Construit une erreur Axios 400 avec un payload field-errors façon DRF
const drfFieldError = (data: Record<string, string[]>) => {
  const headers = new AxiosHeaders();
  return new AxiosError(
    "Bad Request",
    "ERR_BAD_REQUEST",
    { headers },
    null,
    {
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: { headers },
      data,
    }
  );
};

describe("SignupForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("affiche une erreur sur chaque champ requis lors d'une soumission vide", async () => {
    const user = userEvent.setup();
    renderSignupForm();

    await user.click(screen.getByRole("button", { name: /créer mon compte/i }));

    expect(
      await screen.findByText("Saisissez votre adresse email.")
    ).toBeInTheDocument();
    expect(screen.getByText("Saisissez un mot de passe.")).toBeInTheDocument();
    expect(
      screen.getByText("Confirmez votre mot de passe.")
    ).toBeInTheDocument();
  });

  it("rejette un email mal formé", async () => {
    const user = userEvent.setup();
    renderSignupForm();

    await user.type(screen.getByPlaceholderText("Email"), "pas-un-email");
    await user.tab();

    expect(
      await screen.findByText("Adresse email non valide.")
    ).toBeInTheDocument();
  });

  it("rejette un mot de passe trop court", async () => {
    const user = userEvent.setup();
    renderSignupForm();

    await user.type(screen.getByPlaceholderText("Mot de passe"), "abc");
    await user.tab();

    expect(
      await screen.findByText(
        "Le mot de passe doit contenir au moins 8 caractères."
      )
    ).toBeInTheDocument();
  });

  it("signale une confirmation différente du mot de passe", async () => {
    const user = userEvent.setup();
    renderSignupForm();

    await user.type(
      screen.getByPlaceholderText("Mot de passe"),
      "password123"
    );
    await user.type(
      screen.getByPlaceholderText("Confirmer le mot de passe"),
      "password999"
    );
    await user.tab();

    expect(
      await screen.findByText("Les mots de passe ne correspondent pas.")
    ).toBeInTheDocument();
  });

  it("inscrit puis connecte automatiquement et redirige vers /articles", async () => {
    const user = userEvent.setup();
    vi.mocked(api.post)
      // /api/users/create/
      .mockResolvedValueOnce({ data: { id: 1, email: "newbie@example.fr" } })
      // /api/token/
      .mockResolvedValueOnce({ data: { access: "tok", refresh: "ref" } });

    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/articles" element={<div>Page Articles</div>} />
        </Routes>
      </MemoryRouter>
    );

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /créer mon compte/i }));

    expect(await screen.findByText("Page Articles")).toBeInTheDocument();
    expect(api.post).toHaveBeenNthCalledWith(1, API_ENDPOINTS.register, {
      email: "newbie@example.fr",
      password: "password123",
    });
    expect(api.post).toHaveBeenNthCalledWith(2, API_ENDPOINTS.login, {
      email: "newbie@example.fr",
      password: "password123",
    });
    expect(localStorage.getItem("weeb_access_token")).toBe("tok");
  });

  it("remonte les erreurs de champ DRF (ex : email déjà utilisé)", async () => {
    const user = userEvent.setup();
    vi.mocked(api.post).mockRejectedValueOnce(
      drfFieldError({ email: ["Cette adresse email est déjà utilisée."] })
    );
    renderSignupForm();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /créer mon compte/i }));

    expect(
      await screen.findByText("Cette adresse email est déjà utilisée.")
    ).toBeInTheDocument();
  });

  it("redirige vers /login si l'inscription réussit mais l'auto-connexion échoue", async () => {
    const user = userEvent.setup();
    vi.mocked(api.post)
      .mockResolvedValueOnce({ data: { id: 1, email: "newbie@example.fr" } })
      .mockRejectedValueOnce(new Error("network down"));

    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<div>Page Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /créer mon compte/i }));

    expect(await screen.findByText("Page Login")).toBeInTheDocument();
    expect(localStorage.getItem("weeb_access_token")).toBeNull();
  });

  it("affiche un message générique quand l'erreur n'est pas un 400 DRF", async () => {
    const user = userEvent.setup();
    vi.mocked(api.post).mockRejectedValueOnce(new Error("network error"));
    renderSignupForm();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /créer mon compte/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/une erreur est survenue/i)
      ).toBeInTheDocument();
    });
  });
});
