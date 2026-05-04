// JWT token storage helpers — backed by localStorage.
//
// `useAuth()` exposes the auth state reactively so components (e.g. Header)
// re-render when tokens are written/cleared, including across browser tabs.

import { useSyncExternalStore } from "react";

const ACCESS_KEY = "weeb_access_token";
const REFRESH_KEY = "weeb_refresh_token";

// Émis sur chaque setTokens / clearTokens. Utilisé par `useAuth()` pour la
// réactivité, et par les caches data-layer (cf. `invalidatePostCaches` dans
// `data/articles.ts`) pour purger les données dépendantes de l'identité.
export const AUTH_EVENT = "weeb-auth-change";

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

const subscribe = (callback: () => void) => {
  window.addEventListener(AUTH_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

export function useAuth(): boolean {
  return useSyncExternalStore(subscribe, isAuthenticated, isAuthenticated);
}
