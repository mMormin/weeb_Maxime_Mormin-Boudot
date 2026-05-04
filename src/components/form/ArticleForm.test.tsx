import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import ArticleForm from "./ArticleForm";
import { createPost, updatePost, type Article } from "../../data/articles";
import { getMe, updateUsername } from "../../data/users";

vi.mock("../../data/articles", () => ({
  createPost: vi.fn(),
  updatePost: vi.fn(),
}));

vi.mock("../../data/users", () => ({
  getMe: vi.fn(),
  updateUsername: vi.fn(),
}));

// On remplace le RichTextEditor (TipTap/ProseMirror) par un <textarea> dans
// les tests : ProseMirror s'intègre mal avec JSDOM/userEvent et l'objectif
// ici est de couvrir la logique du formulaire, pas le moteur d'édition.
vi.mock("./RichTextEditor", () => ({
  default: ({
    value,
    onChange,
    onBlur,
    ariaLabel,
    placeholder,
  }: {
    value: string;
    onChange: (html: string) => void;
    onBlur?: () => void;
    ariaLabel: string;
    placeholder?: string;
  }) => (
    <textarea
      aria-label={ariaLabel}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => onBlur?.()}
    />
  ),
}));

const renderCreateForm = () =>
  render(
    <MemoryRouter initialEntries={["/articles/new"]}>
      <Routes>
        <Route path="/articles/new" element={<ArticleForm />} />
        <Route
          path="/articles/:slug"
          element={<div>Page détail article</div>}
        />
      </Routes>
    </MemoryRouter>
  );

const renderEditForm = (article: Article) =>
  render(
    <MemoryRouter initialEntries={[`/articles/${article.slug}/edit`]}>
      <Routes>
        <Route
          path="/articles/:slug/edit"
          element={<ArticleForm article={article} />}
        />
        <Route
          path="/articles/:slug"
          element={<div>Page détail article</div>}
        />
      </Routes>
    </MemoryRouter>
  );

const buildArticle = (overrides: Partial<Article> = {}): Article => ({
  id: 1,
  slug: "mon-article",
  title: "Mon article",
  date: "1 mai 2026",
  summary: "",
  category: "Développement",
  categoryKey: "developpement",
  isOwner: true,
  // Contenu non vide par défaut : la validation Yup exige un `content`,
  // sinon les soumissions des tests d'édition sont bloquées avant l'appel
  // à `updatePost`.
  content: "<p>Contenu existant</p>",
  ...overrides,
});

describe("ArticleForm — création", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Par défaut, l'utilisateur a déjà un username : la modal ne s'ouvre pas.
    vi.mocked(getMe).mockResolvedValue({
      id: 1,
      email: "user@example.com",
      username: "alice",
    });
  });

  it("affiche une erreur sur les champs requis lors d'une soumission vide", async () => {
    const user = userEvent.setup();
    renderCreateForm();

    await user.click(screen.getByRole("button", { name: /publier/i }));

    expect(await screen.findByText("Saisissez un titre.")).toBeInTheDocument();
    expect(
      screen.getByText("Rédigez le contenu de l'article.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Sélectionnez une catégorie.")
    ).toBeInTheDocument();
    expect(createPost).not.toHaveBeenCalled();
    expect(getMe).not.toHaveBeenCalled();
  });

  it("accepte un readTime vide (champ optionnel) et soumet le formulaire", async () => {
    const user = userEvent.setup();
    vi.mocked(createPost).mockResolvedValueOnce(buildArticle());
    renderCreateForm();

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
    vi.mocked(createPost).mockResolvedValueOnce(
      buildArticle({
        id: 42,
        slug: "react-19",
        title: "React 19",
        summary: "Tour d'horizon",
      })
    );
    renderCreateForm();

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
    renderCreateForm();

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

  describe("première publication (username vide)", () => {
    beforeEach(() => {
      vi.mocked(getMe).mockResolvedValue({
        id: 1,
        email: "user@example.com",
        username: "",
      });
    });

    const fillValidForm = async (
      user: ReturnType<typeof userEvent.setup>
    ) => {
      await user.type(screen.getByPlaceholderText("Titre"), "Mon article");
      await user.selectOptions(
        screen.getByLabelText("Catégorie"),
        "developpement"
      );
      await user.type(
        screen.getByPlaceholderText(/Contenu de l'article/),
        "Premier paragraphe."
      );
    };

    it("ouvre la modal username et bloque la création tant qu'elle n'est pas soumise", async () => {
      const user = userEvent.setup();
      renderCreateForm();

      await fillValidForm(user);
      await user.click(screen.getByRole("button", { name: /publier/i }));

      expect(
        await screen.findByRole("dialog", { name: /nom d'utilisateur/i })
      ).toBeInTheDocument();
      expect(createPost).not.toHaveBeenCalled();
      expect(updateUsername).not.toHaveBeenCalled();
    });

    it("refuse un username vide et n'appelle pas l'API", async () => {
      const user = userEvent.setup();
      renderCreateForm();

      await fillValidForm(user);
      await user.click(screen.getByRole("button", { name: /publier/i }));

      const dialog = await screen.findByRole("dialog", {
        name: /nom d'utilisateur/i,
      });
      await user.click(screen.getByRole("button", { name: /valider/i }));

      expect(
        await screen.findByText(/saisissez un nom d'utilisateur/i)
      ).toBeInTheDocument();
      expect(updateUsername).not.toHaveBeenCalled();
      expect(dialog).toBeInTheDocument();
    });

    it("enregistre le username puis publie l'article", async () => {
      const user = userEvent.setup();
      vi.mocked(updateUsername).mockResolvedValueOnce({
        id: 1,
        email: "user@example.com",
        username: "alice",
      });
      vi.mocked(createPost).mockResolvedValueOnce(buildArticle());
      renderCreateForm();

      await fillValidForm(user);
      await user.click(screen.getByRole("button", { name: /publier/i }));

      const input = await screen.findByPlaceholderText("Nom d'utilisateur");
      await user.type(input, "alice");
      await user.click(screen.getByRole("button", { name: /valider/i }));

      await waitFor(() => {
        expect(updateUsername).toHaveBeenCalledWith("alice");
      });
      await waitFor(() => {
        expect(createPost).toHaveBeenCalledWith({
          title: "Mon article",
          excerpt: "",
          content: "Premier paragraphe.",
          category: "developpement",
          readTime: 0,
        });
      });
      expect(
        await screen.findByText("Page détail article")
      ).toBeInTheDocument();
    });

    it("affiche une erreur dans la modal si la mise à jour du username échoue", async () => {
      const user = userEvent.setup();
      vi.mocked(updateUsername).mockRejectedValueOnce(new Error("boom"));
      renderCreateForm();

      await fillValidForm(user);
      await user.click(screen.getByRole("button", { name: /publier/i }));

      await user.type(
        await screen.findByPlaceholderText("Nom d'utilisateur"),
        "alice"
      );
      await user.click(screen.getByRole("button", { name: /valider/i }));

      expect(
        await screen.findByText(/impossible d'enregistrer le nom/i)
      ).toBeInTheDocument();
      expect(createPost).not.toHaveBeenCalled();
    });
  });
});

describe("ArticleForm — édition", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("pré-remplit les champs avec l'article fourni", () => {
    renderEditForm(
      buildArticle({
        title: "Titre existant",
        summary: "Résumé existant",
        categoryKey: "performance",
        readTimeMinutes: 7,
        content: "<p>Contenu existant</p>",
      })
    );

    expect(screen.getByPlaceholderText("Titre")).toHaveValue("Titre existant");
    expect(screen.getByPlaceholderText("Résumé (optionnel)")).toHaveValue(
      "Résumé existant"
    );
    expect(screen.getByLabelText("Catégorie")).toHaveValue("performance");
    expect(screen.getByPlaceholderText("Temps de lecture (min)")).toHaveValue(
      7
    );
    expect(screen.getByLabelText("Contenu de l'article")).toHaveValue(
      "<p>Contenu existant</p>"
    );
    expect(
      screen.getByRole("button", { name: /enregistrer/i })
    ).toBeInTheDocument();
  });

  it("appelle updatePost avec le slug et le payload modifié", async () => {
    const user = userEvent.setup();
    const article = buildArticle({
      slug: "react-19",
      title: "React 19",
      categoryKey: "developpement",
      content: "<p>Ancien</p>",
    });
    vi.mocked(updatePost).mockResolvedValueOnce(article);
    renderEditForm(article);

    const titleInput = screen.getByPlaceholderText("Titre");
    await user.clear(titleInput);
    await user.type(titleInput, "React 19 — édition");
    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    await waitFor(() => {
      expect(updatePost).toHaveBeenCalledWith("react-19", {
        title: "React 19 — édition",
        excerpt: "",
        content: "<p>Ancien</p>",
        category: "developpement",
        readTime: 0,
      });
    });
    expect(createPost).not.toHaveBeenCalled();
  });

  it("redirige vers le détail après mise à jour réussie", async () => {
    const user = userEvent.setup();
    const article = buildArticle({ slug: "react-19", title: "React 19" });
    vi.mocked(updatePost).mockResolvedValueOnce(article);
    renderEditForm(article);

    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    expect(
      await screen.findByText("Page détail article")
    ).toBeInTheDocument();
  });

  it("affiche un message d'erreur si la mise à jour échoue", async () => {
    const user = userEvent.setup();
    vi.mocked(updatePost).mockRejectedValueOnce(new Error("server down"));
    renderEditForm(buildArticle());

    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    expect(
      await screen.findByText(/lors de la mise à jour/i)
    ).toBeInTheDocument();
  });
});
