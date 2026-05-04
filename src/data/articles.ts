import axios from "axios";
import { api, API_ENDPOINTS } from "../config/api";
import { AUTH_EVENT } from "../utils/auth";
import { getCategoryLabel } from "./categories";

// Forme retournée par l'API Django REST (`PostSerializer`)
interface RawPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
  author: string;
  is_owner: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  date: string;
  summary: string;
  // Libellé affiché (capitalisé). Pour pré-remplir le `<select>` du formulaire
  // d'édition, utiliser `categoryKey` qui conserve la valeur brute attendue
  // par l'API.
  category: string;
  categoryKey: string;
  size?: "small" | "medium" | "large";
  author?: string;
  // True quand l'article appartient à l'utilisateur authentifié courant.
  // Calculé côté API à partir du JWT — pilote l'affichage "Moi" et les boutons
  // d'édition / de suppression dans `pages/Article/index.tsx`.
  isOwner: boolean;
  readTime?: string;
  // Valeur numérique brute (minutes) utilisée pour pré-remplir le formulaire
  // d'édition. `readTime` reste la version formatée pour l'affichage.
  readTimeMinutes?: number;
  // HTML produit par le RichTextEditor TipTap. Doit être assaini avant rendu
  // (cf. `dangerouslySetInnerHTML` + DOMPurify dans `pages/Article/index.tsx`).
  content?: string;
}

// Payload du formulaire de création d'article (cf. PostSerializer côté Django)
export interface ArticleDraft {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
}

// Singleton : la construction d'un `Intl.DateTimeFormat` est non-triviale,
// et `mapPost` est appelé pour chaque article d'une liste paginée.
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const formatDate = (iso: string): string => dateFormatter.format(new Date(iso));

const formatCategory = (raw: string): string =>
  raw ? getCategoryLabel(raw) : "";

// Article-list grid layout: first card large, next two medium, rest small.
const SIZE_BY_INDEX: Array<NonNullable<Article["size"]>> = [
  "large",
  "medium",
  "medium",
];

const mapPost = (raw: RawPost): Article => ({
  id: raw.id,
  title: raw.title,
  slug: raw.slug,
  date: formatDate(raw.created_at),
  summary: raw.excerpt,
  category: formatCategory(raw.category),
  categoryKey: raw.category,
  author: raw.author || undefined,
  isOwner: Boolean(raw.is_owner),
  readTime: raw.readTime ? `${raw.readTime} min` : undefined,
  readTimeMinutes: raw.readTime || undefined,
  content: raw.content || undefined,
});

const fetchPosts = async (): Promise<Article[]> => {
  const { data } = await api.get<PaginatedResponse<RawPost>>(
    API_ENDPOINTS.posts,
  );
  return data.results.map((raw, i) => ({
    ...mapPost(raw),
    size: SIZE_BY_INDEX[i] ?? "small",
  }));
};

const fetchPostBySlug = async (slug: string): Promise<Article | null> => {
  try {
    const { data } = await api.get<RawPost>(`${API_ENDPOINTS.posts}${slug}/`);
    return mapPost(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// Lazy-memoized: the fetch fires on the first `getPostsPromise()` call (route
// render), not at module import. A rejected promise is evicted so the next
// render can retry instead of replaying the cached error forever.
let postsPromiseCache: Promise<Article[]> | null = null;

export const getPostsPromise = (): Promise<Article[]> => {
  if (!postsPromiseCache) {
    const p = fetchPosts();
    p.catch(() => {
      if (postsPromiseCache === p) postsPromiseCache = null;
    });
    postsPromiseCache = p;
  }
  return postsPromiseCache;
};

const postCache = new Map<string, Promise<Article | null>>();

export const getPostPromise = (slug: string): Promise<Article | null> => {
  const cached = postCache.get(slug);
  if (cached) return cached;

  const p = fetchPostBySlug(slug);
  p.catch(() => {
    if (postCache.get(slug) === p) postCache.delete(slug);
  });
  postCache.set(slug, p);
  return p;
};

// Crée un article via l'API et invalide les caches pour que la prochaine
// visite sur /articles ou /articles/<slug> reflète immédiatement la création.
// Eviction du slug : si le détail avait déjà été demandé (404 mis en cache,
// par ex. via un crawler), la navigation post-création verrait un null périmé.
export const createPost = async (draft: ArticleDraft): Promise<Article> => {
  const { data } = await api.post<RawPost>(API_ENDPOINTS.posts, draft);
  postsPromiseCache = null;
  postCache.delete(data.slug);
  return mapPost(data);
};

// Met à jour un article existant. Le slug est read-only côté API : la mise
// à jour ne peut pas le changer, donc l'URL de détail reste valide. On
// invalide la liste et on remplace l'entrée du cache par la version fraîche
// pour que la prochaine navigation reflète immédiatement la modification.
export const updatePost = async (
  slug: string,
  draft: ArticleDraft,
): Promise<Article> => {
  const { data } = await api.patch<RawPost>(
    `${API_ENDPOINTS.posts}${slug}/`,
    draft,
  );
  const article = mapPost(data);
  postsPromiseCache = null;
  postCache.set(slug, Promise.resolve(article));
  return article;
};

// Supprime un article et invalide les caches pour que /articles et le détail
// reflètent immédiatement la suppression (sinon `use(getPostPromise)` ressert
// l'article supprimé jusqu'au prochain reload).
export const deletePost = async (slug: string): Promise<void> => {
  await api.delete(`${API_ENDPOINTS.posts}${slug}/`);
  postsPromiseCache = null;
  postCache.delete(slug);
};

// Vide les caches de posts. Appelé sur changement d'auth (login/logout) car
// `is_owner` est calculé côté API à partir du JWT — un cache hérité d'une
// session précédente afficherait des "Modifier"/"Supprimer" pour les mauvais
// articles, voire ceux d'un autre utilisateur.
export const invalidatePostCaches = (): void => {
  postsPromiseCache = null;
  postCache.clear();
};

// Auto-invalidation : `auth.ts` émet `AUTH_EVENT` à chaque setTokens /
// clearTokens. En se branchant ici (côté data) plutôt que dans `auth.ts` on
// évite un cycle d'imports `auth → articles → config/api → auth`.
if (typeof window !== "undefined") {
  window.addEventListener(AUTH_EVENT, invalidatePostCaches);
}
