import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { MemoryRouter, Route, Routes } from "react-router";
import Article from "./index";
import { getPostPromise } from "../../data/articles";

// `getPostPromise` is a function so we can vary its return value per test.
vi.mock("../../data/articles", () => ({
  getPostPromise: vi.fn(),
}));

// React 19's `use()` suspends on the first render and resumes after the
// promise resolves in a microtask. Wrapping in `await act(...)` lets React
// commit the resolved render before assertions run.
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
        author: "Anonyme",
        readTime: "4 min",
        content: ["Premier paragraphe du corps."],
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
