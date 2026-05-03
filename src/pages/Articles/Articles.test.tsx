import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { MemoryRouter, Route, Routes } from "react-router";
import Articles from "./index";

// Mock the data module so the page reads a deterministic article list
// instead of triggering a real network call. The promise is memoized so
// `use()` sees a stable reference across re-renders (React 19 contract).
vi.mock("../../data/articles", () => {
  const promise = Promise.resolve([
    {
      id: 1,
      slug: "react-19",
      title: "Quoi de neuf dans React 19",
      date: "1 mai 2026",
      summary: "Tour d'horizon des nouveautés",
      category: "Développement",
      size: "large",
    },
    {
      id: 2,
      slug: "css-modern",
      title: "CSS moderne en 2026",
      date: "2 mai 2026",
      summary: "Container queries et au-delà",
      category: "CSS",
      size: "small",
    },
  ]);
  return { getPostsPromise: () => promise };
});

// React 19's `use()` suspends on the first render and resumes after the
// promise resolves in a microtask. Wrapping in `await act(...)` lets React
// commit the resolved render before assertions run.
const renderArticles = async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={["/articles"]}>
        <Suspense fallback={<div>Chargement…</div>}>
          <Routes>
            <Route path="/articles" element={<Articles />} />
            <Route
              path="/articles/:slug"
              element={<div>Page détail article</div>}
            />
          </Routes>
        </Suspense>
      </MemoryRouter>
    );
  });
};

describe("Articles page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("affiche les titres des articles renvoyés par l'API", async () => {
    await renderArticles();

    expect(
      screen.getByText("Quoi de neuf dans React 19")
    ).toBeInTheDocument();
    expect(screen.getByText("CSS moderne en 2026")).toBeInTheDocument();
  });

  it("navigue vers le détail quand on clique sur un article", async () => {
    const user = userEvent.setup();
    await renderArticles();

    await user.click(screen.getByText("Quoi de neuf dans React 19"));

    expect(
      await screen.findByText("Page détail article")
    ).toBeInTheDocument();
  });
});
