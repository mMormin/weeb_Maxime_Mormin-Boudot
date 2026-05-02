import type { ReactNode } from "react";
import { seoDatas, BASE_URL } from "./seoData";

export { seoDatas, BASE_URL };

// Type décrivant les métadonnées SEO pour chaque route
type Metas = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  children?: ReactNode;
};

// Génère les métadonnées SEO pour chaque route
export const routeMetas: Record<string, Metas> = Object.fromEntries(
  seoDatas.map(({ path, title, description }) => {
    const fullUrl = `${BASE_URL}${path}`;
    const ogImage = `${BASE_URL}/cover.webp`;

    // Balises SEO par défaut (OG + Twitter)
    const defaultChildren = (
      <>
        {/* URL canonique */}
        <link rel="canonical" href={fullUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </>
    );

    return [
      path,
      {
        title,
        description,
        ogTitle: title,
        ogDescription: description,
        // Noindex pour la page contact (pas d'indexation)
        children:
          path === "/contact" ? (
            <>
              <meta name="robots" content="noindex" />
              {defaultChildren}
            </>
          ) : (
            defaultChildren
          ),
      },
    ];
  })
);
