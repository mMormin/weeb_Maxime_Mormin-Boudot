import { useSyncExternalStore } from "react";
import { api, API_ENDPOINTS } from "../config/api";
import { AUTH_EVENT, isAuthenticated } from "../utils/auth";

// Profil renvoyé par GET /api/users/me/. `username` est vide tant que
// l'utilisateur n'a pas choisi son nom d'auteur — sa première publication
// d'article déclenche la modal qui le renseigne (cf. ArticleForm).
export interface CurrentUser {
  id: number;
  email: string;
  username: string;
}

export const getMe = async (): Promise<CurrentUser> => {
  const { data } = await api.get<CurrentUser>(API_ENDPOINTS.me);
  return data;
};

// Store réactif de l'username courant — calé sur le pattern de `useAuth()`.
// Adossé à localStorage pour survivre aux reloads et se synchroniser entre
// onglets. `useSyncExternalStore` côté composant garantit un rendu cohérent.
const USERNAME_KEY = "weeb_username";
const USERNAME_EVENT = "weeb-username-change";

const getStoredUsername = (): string | null =>
  localStorage.getItem(USERNAME_KEY);

const setStoredUsername = (username: string): void => {
  if (username) {
    localStorage.setItem(USERNAME_KEY, username);
  } else {
    localStorage.removeItem(USERNAME_KEY);
  }
  window.dispatchEvent(new Event(USERNAME_EVENT));
};

const clearStoredUsername = (): void => {
  localStorage.removeItem(USERNAME_KEY);
  window.dispatchEvent(new Event(USERNAME_EVENT));
};

const subscribeUsername = (callback: () => void) => {
  window.addEventListener(USERNAME_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(USERNAME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

// Bootstrap : déclenché à la 1re lecture de useUsername quand un token existe
// déjà mais que le store local est vide (page reload sur session active). On
// passe par un flag de module pour rester idempotent face au double-render
// de StrictMode et aux re-rendus multiples avant la résolution du fetch.
let initialSyncDone = false;

export function useUsername(): string | null {
  if (!initialSyncDone && typeof window !== "undefined") {
    initialSyncDone = true;
    if (isAuthenticated() && !getStoredUsername()) {
      syncUsernameWithAuth();
    }
  }
  return useSyncExternalStore(
    subscribeUsername,
    getStoredUsername,
    getStoredUsername,
  );
}

export const updateUsername = async (
  username: string,
): Promise<CurrentUser> => {
  const { data } = await api.patch<CurrentUser>(API_ENDPOINTS.me, { username });
  setStoredUsername(data.username);
  return data;
};

// Synchronise le store username avec l'état d'auth. Lors d'un login le store
// est rempli depuis /me ; lors d'un logout il est vidé pour éviter d'afficher
// l'identité d'une session précédente. Erreurs réseau silencieuses : un échec
// laisse simplement le store vide, ce qui revient à ne pas afficher d'username.
const syncUsernameWithAuth = (): void => {
  if (!isAuthenticated()) {
    clearStoredUsername();
    return;
  }
  void getMe()
    .then((me) => setStoredUsername(me.username))
    .catch(() => {
      /* noop */
    });
};

// Listener seul au chargement du module : pas de fetch ici. Le bootstrap
// initial est déclenché à la 1re invocation de useUsername (cf. ci-dessus)
// pour découpler la requête réseau de l'évaluation du module.
if (typeof window !== "undefined") {
  window.addEventListener(AUTH_EVENT, syncUsernameWithAuth);
}
