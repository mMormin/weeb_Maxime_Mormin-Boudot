import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import type { Plugin } from "vite";
import { generateSitemap } from "./src/scripts/generate-sitemap";

function sitemapPlugin(): Plugin {
  return {
    name: "sitemap",
    closeBundle: async () => {
      await generateSitemap();
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sitemapPlugin()],
});
