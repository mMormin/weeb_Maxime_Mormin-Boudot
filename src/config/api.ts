import axios from "axios";
import { getAccessToken } from "../utils/auth";

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
