import axios from "axios";

// URL de base de l'API selon l'environnement
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://localhost:8000";

// Endpoints de l'API Django
export const API_ENDPOINTS = {
  contact: "/api/contact/",
  login: "/api/auth/login/",
  register: "/api/auth/register/",
  articles: "/api/articles/",
} as const;

// Instance Axios configurée pour l'API Django
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Nécessaire pour les cookies Django (CSRF)
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur : ajoute automatiquement le token CSRF aux requêtes
api.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];

  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});
