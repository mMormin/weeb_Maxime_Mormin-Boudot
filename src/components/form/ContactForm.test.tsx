import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";
import { api, API_ENDPOINTS } from "../../config/api";

vi.mock("../../config/api", () => ({
  api: { post: vi.fn() },
  API_ENDPOINTS: { contact: "/api/contact/" },
}));

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByPlaceholderText("Nom"), "Dupont");
  await user.type(screen.getByPlaceholderText("Prénom"), "Jean");
  await user.type(screen.getByPlaceholderText("Téléphone"), "0612345678");
  await user.type(
    screen.getByPlaceholderText("Email"),
    "jean.dupont@example.fr"
  );
  await user.type(
    screen.getByPlaceholderText("Votre message"),
    "Bonjour, j'aime beaucoup votre blog."
  );
};

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche une erreur sur chaque champ requis lors d'une soumission vide", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /envoyer/i }));

    expect(
      await screen.findByText("Saisissez votre nom.")
    ).toBeInTheDocument();
    expect(screen.getByText("Saisissez votre prénom.")).toBeInTheDocument();
    expect(
      screen.getByText("Saisissez votre numéro de téléphone.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Saisissez votre adresse email.")
    ).toBeInTheDocument();
    expect(screen.getByText("Saisissez votre message.")).toBeInTheDocument();
  });

  it("rejette un email mal formé", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByPlaceholderText("Email"), "pas-un-email");
    await user.tab();

    expect(
      await screen.findByText("Adresse email non valide.")
    ).toBeInTheDocument();
  });

  it("rejette un numéro de téléphone qui ne respecte pas le format français", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByPlaceholderText("Téléphone"), "abc");
    await user.tab();

    expect(
      await screen.findByText("Numéro de téléphone non valide.")
    ).toBeInTheDocument();
  });

  it("ne signale pas d'erreur de format pour un numéro français valide", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByPlaceholderText("Téléphone"), "0612345678");
    await user.tab();

    await waitFor(() => {
      expect(
        screen.queryByText("Numéro de téléphone non valide.")
      ).not.toBeInTheDocument();
    });
  });

  it("envoie le payload attendu à l'API en cas de soumission valide", async () => {
    const user = userEvent.setup();
    vi.mocked(api.post).mockResolvedValueOnce({ data: { id: 1 } });
    render(<ContactForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /envoyer/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(API_ENDPOINTS.contact, {
        lastName: "Dupont",
        name: "Jean",
        phone: "0612345678",
        email: "jean.dupont@example.fr",
        message: "Bonjour, j'aime beaucoup votre blog.",
      });
    });
  });

  it("affiche une confirmation et réinitialise le formulaire après envoi réussi", async () => {
    const user = userEvent.setup();
    vi.mocked(api.post).mockResolvedValueOnce({ data: { id: 1 } });
    render(<ContactForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /envoyer/i }));

    expect(
      await screen.findByText(/votre message a été envoyé avec succès/i)
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Nom")).toHaveValue("");
      expect(screen.getByPlaceholderText("Votre message")).toHaveValue("");
    });
  });

  it("affiche un message d'erreur si l'API rejette la requête", async () => {
    const user = userEvent.setup();
    vi.mocked(api.post).mockRejectedValueOnce(new Error("network error"));
    render(<ContactForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /envoyer/i }));

    expect(
      await screen.findByText(/une erreur est survenue/i)
    ).toBeInTheDocument();
  });
});
