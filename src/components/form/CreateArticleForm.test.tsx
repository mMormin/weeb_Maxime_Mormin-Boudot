import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import CreateArticleForm from "./CreateArticleForm";
import { createPost } from "../../data/articles";

vi.mock("../../data/articles", () => ({
  createPost: vi.fn(),
}));

const renderForm = () =>
  render(
    <MemoryRouter initialEntries={["/articles/new"]}>
      <Routes>
        <Route path="/articles/new" element={<CreateArticleForm />} />
        <Route
          path="/articles/:slug"
          element={<div>Page détail article</div>}
        />
      </Routes>
    </MemoryRouter>
  );

describe("CreateArticleForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche une erreur sur les champs requis lors d'une soumission vide", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: /publier/i }));

    expect(await screen.findByText("Saisissez un titre.")).toBeInTheDocument();
    expect(
      screen.getByText("Rédigez le contenu de l'article.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Sélectionnez une catégorie.")
    ).toBeInTheDocument();
    expect(createPost).not.toHaveBeenCalled();
  });

  it("accepte un readTime vide (champ optionnel) et soumet le formulaire", async () => {
    const user = userEvent.setup();
    vi.mocked(createPost).mockResolvedValueOnce({
      id: 1,
      slug: "mon-article",
      title: "Mon article",
      date: "1 mai 2026",
      summary: "",
      category: "Développement",
    });
    renderForm();

    await user.type(screen.getByPlaceholderText("Titre"), "Mon article");
    await user.selectOptions(
      screen.getByLabelText("Catégorie"),
      "developpement"
    );
    await user.type(
      screen.getByPlaceholderText(/Contenu de l'article/),
      "Premier paragraphe."
    );
    await user.click(screen.getByRole("button", { name: /publier/i }));

    await waitFor(() => {
      expect(createPost).toHaveBeenCalledWith({
        title: "Mon article",
        excerpt: "",
        content: "Premier paragraphe.",
        category: "developpement",
        readTime: 0,
      });
    });
  });

  it("redirige vers le détail de l'article après création réussie", async () => {
    const user = userEvent.setup();
    vi.mocked(createPost).mockResolvedValueOnce({
      id: 42,
      slug: "react-19",
      title: "React 19",
      date: "1 mai 2026",
      summary: "Tour d'horizon",
      category: "Développement",
    });
    renderForm();

    await user.type(screen.getByPlaceholderText("Titre"), "React 19");
    await user.selectOptions(
      screen.getByLabelText("Catégorie"),
      "developpement"
    );
    await user.type(
      screen.getByPlaceholderText(/Contenu de l'article/),
      "Le contenu."
    );
    await user.type(
      screen.getByPlaceholderText("Temps de lecture (min)"),
      "5"
    );
    await user.click(screen.getByRole("button", { name: /publier/i }));

    expect(
      await screen.findByText("Page détail article")
    ).toBeInTheDocument();
  });

  it("affiche un message d'erreur inline si l'API rejette la requête", async () => {
    const user = userEvent.setup();
    vi.mocked(createPost).mockRejectedValueOnce(new Error("server down"));
    renderForm();

    await user.type(screen.getByPlaceholderText("Titre"), "Titre");
    await user.selectOptions(
      screen.getByLabelText("Catégorie"),
      "developpement"
    );
    await user.type(
      screen.getByPlaceholderText(/Contenu de l'article/),
      "Le contenu."
    );
    await user.click(screen.getByRole("button", { name: /publier/i }));

    expect(
      await screen.findByText(/une erreur est survenue/i)
    ).toBeInTheDocument();
  });
});
