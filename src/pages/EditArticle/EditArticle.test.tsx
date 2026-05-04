import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { MemoryRouter, Route, Routes } from "react-router";
import EditArticle from "./index";
import { getPostPromise, type Article } from "../../data/articles";
import { setTokens, clearTokens } from "../../utils/auth";

vi.mock("../../data/articles", () => ({
  getPostPromise: vi.fn(),
}));

// On remplace `ArticleForm` par un composant marqueur qui expose les props
// reçues : on n'a pas besoin de retester la logique du formulaire ici, juste
// de vérifier qu'EditArticle lui passe bien l'article courant (et donc bascule
// en mode édition).
vi.mock("../../components/form/ArticleForm", () => ({
  default: ({ article }: { article?: Article }) => (
    <div data-testid="article-form">
      Formulaire pour : {article?.slug ?? "(création)"}
    </div>
  ),
}));

const buildArticle = (overrides: Partial<Article> = {}): Article => ({
  id: 1,
  slug: "mon-article",
  title: "Mon article",
  date: "1 mai 2026",
  summary: "",
  category: "Développement",
  categoryKey: "developpement",
  isOwner: true,
  content: "<p>Contenu</p>",
  ...overrides,
});

const renderEditAt = async (slug: string) => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/articles/${slug}/edit`]}>
        <Suspense fallback={<div>Chargement…</div>}>
          <Routes>
            <Route path="/articles/:slug/edit" element={<EditArticle />} />
            <Route path="/login" element={<div>Page Connexion</div>} />
            <Route path="/articles" element={<div>Page Liste</div>} />
            <Route
              path="/articles/:slug"
              element={<div>Page Détail</div>}
            />
          </Routes>
        </Suspense>
      </MemoryRouter>
    );
  });
};

describe("EditArticle page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearTokens();
    localStorage.clear();
  });

  it("redirige vers /login quand l'utilisateur n'est pas authentifié", async () => {
    await renderEditAt("mon-article");

    expect(screen.getByText("Page Connexion")).toBeInTheDocument();
    // getPostPromise ne doit pas être appelé : la garde d'auth coupe avant
    // toute requête réseau.
    expect(getPostPromise).not.toHaveBeenCalled();
  });

  it("redirige vers /articles quand le slug est introuvable", async () => {
    setTokens("tok", "ref");
    vi.mocked(getPostPromise).mockReturnValue(Promise.resolve(null));

    await renderEditAt("inexistant");

    expect(screen.getByText("Page Liste")).toBeInTheDocument();
  });

  it("redirige vers le détail si l'utilisateur authentifié n'est pas propriétaire", async () => {
    setTokens("tok", "ref");
    vi.mocked(getPostPromise).mockReturnValue(
      Promise.resolve(buildArticle({ slug: "react-19", isOwner: false }))
    );

    await renderEditAt("react-19");

    expect(screen.getByText("Page Détail")).toBeInTheDocument();
  });

  it("rend le formulaire d'édition pré-rempli pour le propriétaire", async () => {
    setTokens("tok", "ref");
    vi.mocked(getPostPromise).mockReturnValue(
      Promise.resolve(
        buildArticle({ slug: "react-19", title: "React 19", isOwner: true })
      )
    );

    await renderEditAt("react-19");

    expect(screen.getByText("Modifier l'article")).toBeInTheDocument();
    expect(screen.getByTestId("article-form")).toHaveTextContent(
      "Formulaire pour : react-19"
    );
  });
});
