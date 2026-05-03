import axios from "axios";
import { api, API_ENDPOINTS } from "../config/api";

// Shape returned by the Django REST API (`PostSerializer`)
interface RawPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
  author: string;
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
  category: string;
  size?: "small" | "medium" | "large";
  author?: string;
  readTime?: string;
  content?: string[];
}

// Payload du formulaire de création d'article (cf. PostSerializer côté Django)
export interface ArticleDraft {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
}

const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));

const formatCategory = (raw: string): string =>
  raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : "";

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
  author: raw.author || undefined,
  readTime: raw.readTime ? `${raw.readTime} min` : undefined,
  // Backend contract: `content` is plain text with paragraphs separated by
  // blank lines. Markdown/HTML would render literally — convert upstream first.
  content: raw.content
    ? raw.content
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
    : undefined,
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
