import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { SitemapStream, streamToPromise } from "sitemap";
import { BASE_URL, seoDatas } from "../utils/seoData";

export async function generateSitemap() {
  const sitemapStream = new SitemapStream({ hostname: BASE_URL });

  seoDatas.forEach(({ path }) => {
    sitemapStream.write({
      url: path,
      changefreq: "weekly",
      priority: 0.8,
    });
  });

  sitemapStream.end();

  const sitemapOutput = await streamToPromise(sitemapStream).then((sm) =>
    sm.toString()
  );

  const outputPath = resolve(process.cwd(), "public", "sitemap.xml");
  writeFileSync(outputPath, sitemapOutput, "utf8");

  console.log(`Sitemap generated at: ${outputPath}`);
}
