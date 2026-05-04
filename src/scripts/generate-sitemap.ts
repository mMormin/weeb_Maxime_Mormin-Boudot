import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { SitemapStream, streamToPromise } from "sitemap";
import { BASE_URL, seoDatas } from "../utils/seoData";

interface RawPost {
  slug: string;
}

interface PaginatedResponse<T> {
  next: string | null;
  results: T[];
}

// Garde-fou sur la pagination : un `next` mal configuré ou un backend
// emballé ne doit pas pouvoir faire tourner le build à l'infini. 100 pages
// × taille de page par défaut, c'est largement plus que ce que ce site
// publiera jamais.
const MAX_SITEMAP_PAGES = 100;

const fetchPostSlugs = async (): Promise<string[]> => {
  const apiUrl = process.env.VITE_API_URL ?? "http://localhost:8000";
  const slugs: string[] = [];
  let next: string | null = `${apiUrl}/api/posts/`;
  let page = 0;
  try {
    while (next && page < MAX_SITEMAP_PAGES) {
      const response = await fetch(next);
      if (!response.ok) break;
      const body = (await response.json()) as PaginatedResponse<RawPost>;
      slugs.push(...body.results.map((post) => post.slug));
      next = body.next;
      page += 1;
    }
    if (next) {
      console.warn(
        `Sitemap: stopped after ${MAX_SITEMAP_PAGES} pages — pagination cap hit.`,
      );
    }
  } catch (error) {
    // L'API peut ne pas être joignable au build (ex. CI sans backend lancé).
    // On émet quand même un sitemap avec les routes statiques ; les URLs
    // par article seront découvertes par crawl depuis la page /articles.
    console.warn(`Sitemap: skipping per-article URLs (${String(error)}).`);
  }
  return slugs;
};

export async function generateSitemap(outDir = "dist") {
  const sitemapStream = new SitemapStream({ hostname: BASE_URL });

  seoDatas.forEach(({ path }) => {
    sitemapStream.write({
      url: path,
      changefreq: "weekly",
      priority: 0.8,
    });
  });

  const slugs = await fetchPostSlugs();
  slugs.forEach((slug) => {
    sitemapStream.write({
      url: `/articles/${slug}`,
      changefreq: "monthly",
      priority: 0.6,
    });
  });

  sitemapStream.end();

  const sitemapOutput = await streamToPromise(sitemapStream).then((sm) =>
    sm.toString()
  );

  const resolvedOutDir = resolve(process.cwd(), outDir);
  mkdirSync(resolvedOutDir, { recursive: true });
  const outputPath = resolve(resolvedOutDir, "sitemap.xml");
  writeFileSync(outputPath, sitemapOutput, "utf8");

  console.log(`Sitemap generated at: ${outputPath}`);
}
