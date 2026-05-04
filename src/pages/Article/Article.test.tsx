import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { MemoryRouter, Route, Routes } from "react-router";
import Article from "./index";
import { getPostPromise } from "../../data/articles";

// `getPostPromise` est une fonction, ce qui permet de faire varier sa valeur
// de retour selon le test.
vi.mock("../../data/articles", () => ({
  getPostPromise: vi.fn(),
}));

// `use()` de React 19 suspend au premier render et reprend une fois la
// promesse résolue dans une microtask. Le `await act(...)` laisse React
// committer le render résolu avant que les assertions ne tournent.
const renderArticleAt = async (slug: string) => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/articles/${slug}`]}>
        <Suspense fallback={<div>Chargement…</div>}>
          <Routes>
            <Route path="/articles/:slug" element={<Article />} />
          </Routes>
        </Suspense>
      </MemoryRouter>
    );
  });
};

describe("Article page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("affiche le titre et le contenu de l'article retourné par l'API", async () => {
    vi.mocked(getPostPromise).mockReturnValue(
      Promise.resolve({
        id: 1,
        slug: "react-19",
        title: "Quoi de neuf dans React 19",
        date: "1 mai 2026",
        summary: "Tour d'horizon des nouveautés",
        category: "Développement",
        categoryKey: "developpement",
        author: "Anonyme",
        isOwner: false,
        readTime: "4 min",
        readTimeMinutes: 4,
        content: "<p>Premier paragraphe du corps.</p>",
      })
    );

    await renderArticleAt("react-19");

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Quoi de neuf dans React 19",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Premier paragraphe du corps.")
    ).toBeInTheDocument();
  });

  it("affiche le fallback 'Article non trouvé' quand l'API renvoie null", async () => {
    vi.mocked(getPostPromise).mockReturnValue(Promise.resolve(null));

    await renderArticleAt("inexistant");

    expect(screen.getByText("Article non trouvé")).toBeInTheDocument();
  });
});
