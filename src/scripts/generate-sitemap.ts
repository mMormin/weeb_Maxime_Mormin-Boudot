import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { SitemapStream, streamToPromise } from "sitemap";
import { BASE_URL, seoDatas } from "../utils/seoData";
import { articles, getArticleSlug } from "../data/articles";

export async function generateSitemap(outDir = "dist") {
  const sitemapStream = new SitemapStream({ hostname: BASE_URL });

  seoDatas.forEach(({ path }) => {
    sitemapStream.write({
      url: path,
      changefreq: "weekly",
      priority: 0.8,
    });
  });

  articles.forEach((article) => {
    sitemapStream.write({
      url: `/articles/${getArticleSlug(article)}`,
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
