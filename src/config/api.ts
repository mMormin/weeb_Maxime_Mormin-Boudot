import axios, { type InternalAxiosRequestConfig } from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "../utils/auth";

// URL de base de l'API selon l'environnement
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// Endpoints de l'API Django
export const API_ENDPOINTS = {
  contact: "/api/contact/",
  login: "/api/token/",
  refresh: "/api/token/refresh/",
  register: "/api/users/create/",
  posts: "/api/posts/",
  me: "/api/users/me/",
} as const;

// Instance Axios configurée pour l'API Django (auth JWT, pas de session/CSRF)
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur : ajoute automatiquement le token JWT aux requêtes authentifiées
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh partagé : si plusieurs requêtes tombent en 401 simultanément,
// un seul appel à /api/token/refresh/ part et les autres attendent son résultat.
let refreshPromise: Promise<string> | null = null;

// Intercepteur : sur 401, tente un refresh puis rejoue la requête initiale.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!original || error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refresh = getRefreshToken();
    if (!refresh) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      refreshPromise ??= axios
        .post<{ access: string; refresh?: string }>(
          `${API_BASE_URL}${API_ENDPOINTS.refresh}`,
          { refresh },
        )
        .then((res) => {
          setTokens(res.data.access, res.data.refresh ?? refresh);
          return res.data.access;
        })
        .finally(() => {
          refreshPromise = null;
        });

      await refreshPromise;
      // Le replay passe par le request interceptor qui réinjecte le nouveau
      // token via getAccessToken() — pas besoin de réécrire le header ici.
      return api(original);
    } catch (refreshError) {
      clearTokens();
      // Hard reload : le client API n'a pas accès au router. Acceptable car
      // le refresh expiré invalide aussi tout l'état en mémoire (cache, store).
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    }
  },
);
