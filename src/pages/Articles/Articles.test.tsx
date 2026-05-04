import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { MemoryRouter, Route, Routes } from "react-router";
import Articles from "./index";

// Mock du module data pour que la page lise une liste déterministe au lieu
// de déclencher un vrai appel réseau. La promesse est mémoïsée pour que
// `use()` voie une référence stable d'un render à l'autre (contrat React 19).
vi.mock("../../data/articles", () => {
  const promise = Promise.resolve([
    {
      id: 1,
      slug: "react-19",
      title: "Quoi de neuf dans React 19",
      date: "1 mai 2026",
      summary: "Tour d'horizon des nouveautés",
      category: "Développement",
      categoryKey: "developpement",
      size: "large",
      isOwner: false,
    },
    {
      id: 2,
      slug: "css-modern",
      title: "CSS moderne en 2026",
      date: "2 mai 2026",
      summary: "Container queries et au-delà",
      category: "Design",
      categoryKey: "design",
      size: "small",
      isOwner: false,
    },
  ]);
  return { getPostsPromise: () => promise };
});

// `use()` de React 19 suspend au premier render et reprend une fois la
// promesse résolue dans une microtask. Le `await act(...)` laisse React
// committer le render résolu avant que les assertions ne tournent.
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
