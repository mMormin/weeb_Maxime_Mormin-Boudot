import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { SitemapStream, streamToPromise } from "sitemap";
import { BASE_URL, seoDatas } from "../utils/routeMetas";

async function generateSitemap() {
  // Create a sitemap stream instance with the base hostname
  const sitemapStream = new SitemapStream({ hostname: BASE_URL });

  // Loop through each SEO data route and add its path to the sitemap
  seoDatas.forEach(({ path }) => {
    sitemapStream.write({
      url: path,
      changefreq: "weekly",
      priority: 0.8,
    });
  });

  sitemapStream.end();

  // Convert the stream data to a string
  const sitemapOutput = await streamToPromise(sitemapStream).then((sm) =>
    sm.toString()
  );

  // Resolve the path where the sitemap.xml file should be saved
  const outputPath = resolve(process.cwd(), "public", "sitemap.xml");
  writeFileSync(outputPath, sitemapOutput, "utf8");

  console.log(`Sitemap generated at: ${outputPath}`);
}

// Only generate sitemap if running in production environment
if (process.env.NODE_ENV === "production") {
  generateSitemap().catch((error) => {
    console.error("Sitemap generation failed:", error);
    process.exit(1);
  });
}
