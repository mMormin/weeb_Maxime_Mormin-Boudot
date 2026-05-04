import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Header from "./Header";
import { setTokens, clearTokens } from "../../utils/auth";

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );

// Override the matchMedia polyfill from setup.ts so the mobile branch renders.
const useMobileViewport = () => {
  const original = window.matchMedia;
  beforeEach(() => {
    window.matchMedia = (query: string) =>
      ({
        matches: query.includes("max-width: 1024px"),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
  });
  afterEach(() => {
    window.matchMedia = original;
  });
};

describe("Header (desktop)", () => {
  beforeEach(() => {
    localStorage.clear();
    clearTokens();
  });

  it("affiche 'Se connecter' quand l'utilisateur n'est pas authentifié", () => {
    renderHeader();

    expect(screen.getByText("Se connecter")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Se déconnecter" })
    ).not.toBeInTheDocument();
  });

  it("affiche le bouton de déconnexion quand un access token est présent", () => {
    setTokens("tok", "ref");

    renderHeader();

    expect(
      screen.getByRole("button", { name: "Se déconnecter" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Se connecter")).not.toBeInTheDocument();
  });

  it("efface les tokens et bascule l'UI quand on clique sur le bouton de déconnexion", async () => {
    const user = userEvent.setup();
    setTokens("tok", "ref");
    renderHeader();

    await user.click(screen.getByRole("button", { name: "Se déconnecter" }));

    expect(localStorage.getItem("weeb_access_token")).toBeNull();
    expect(localStorage.getItem("weeb_refresh_token")).toBeNull();
    expect(await screen.findByText("Se connecter")).toBeInTheDocument();
  });
});

describe("Header (mobile)", () => {
  useMobileViewport();

  beforeEach(() => {
    localStorage.clear();
    clearTokens();
  });

  it("affiche 'Se déconnecter' dans le menu mobile quand authentifié", async () => {
    const user = userEvent.setup();
    setTokens("tok", "ref");
    renderHeader();

    // Le menu mobile est fermé par défaut — l'ouvrir.
    await user.click(screen.getByRole("button", { name: /ouvrir le menu/i }));

    expect(
      screen.getByRole("button", { name: "Se déconnecter" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Se connecter")).not.toBeInTheDocument();
  });

  it("affiche 'Se connecter' dans le menu mobile quand anonyme", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole("button", { name: /ouvrir le menu/i }));

    expect(screen.getByText("Se connecter")).toBeInTheDocument();
    expect(screen.queryByText("Se déconnecter")).not.toBeInTheDocument();
  });
});

