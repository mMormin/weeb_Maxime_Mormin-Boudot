import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import type { Plugin } from "vite";
import { generateSitemap } from "./src/scripts/generate-sitemap";

function sitemapPlugin(): Plugin {
  return {
    name: "sitemap",
    apply: "build",
    // writeBundle (et non closeBundle) garantit que sitemap.xml est écrit
    // directement dans le dossier de sortie (dist/), avant que le build ne
    // termine. closeBundle s'exécute après la copie de public/ et provoquait
    // un sitemap décalé d'un build (voire absent au premier passage CI).
    writeBundle: async (options) => {
      await generateSitemap(options.dir ?? "dist");
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sitemapPlugin()],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router"],
          motion: ["motion"],
          icons: ["react-icons", "lucide-react"],
          forms: ["formik", "yup"],
        },
      },
    },
  },
});
