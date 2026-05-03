import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import LoginForm from "./LoginForm";
import { api, API_ENDPOINTS } from "../../config/api";

vi.mock("../../config/api", () => ({
  api: { post: vi.fn() },
  API_ENDPOINTS: { login: "/api/token/" },
}));

const renderLoginForm = () =>
  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("affiche une erreur sur chaque champ requis lors d'une soumission vide", async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    expect(
      await screen.findByText("Saisissez votre adresse email.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Saisissez votre mot de passe.")
    ).toBeInTheDocument();
  });

  it("rejette un email mal formé", async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByPlaceholderText("Email"), "pas-un-email");
    await user.tab();

    expect(
      await screen.findByText("Adresse email non valide.")
    ).toBeInTheDocument();
  });

  it("envoie email et mot de passe à l'API lors d'une soumission valide", async () => {
    const user = userEvent.setup();
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { access: "token", refresh: "refresh" },
    });
    renderLoginForm();

    await user.type(
      screen.getByPlaceholderText("Email"),
      "admin@example.fr"
    );
    await user.type(screen.getByPlaceholderText("Mot de passe"), "secret123");
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(API_ENDPOINTS.login, {
        email: "admin@example.fr",
        password: "secret123",
      });
    });
  });

  it("redirige vers /articles après une connexion réussie", async () => {
    const user = userEvent.setup();
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { access: "tok", refresh: "ref" },
    });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/articles" element={<div>Page Articles</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(
      screen.getByPlaceholderText("Email"),
      "admin@example.fr"
    );
    await user.type(screen.getByPlaceholderText("Mot de passe"), "secret123");
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    expect(await screen.findByText("Page Articles")).toBeInTheDocument();
    expect(localStorage.getItem("weeb_access_token")).toBe("tok");
  });

  it("affiche un message d'erreur si l'API rejette la requête", async () => {
    const user = userEvent.setup();
    vi.mocked(api.post).mockRejectedValueOnce(new Error("invalid credentials"));
    renderLoginForm();

    await user.type(
      screen.getByPlaceholderText("Email"),
      "admin@example.fr"
    );
    await user.type(
      screen.getByPlaceholderText("Mot de passe"),
      "wrongpassword"
    );
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    expect(
      await screen.findByText(/une erreur est survenue/i)
    ).toBeInTheDocument();
  });
});
