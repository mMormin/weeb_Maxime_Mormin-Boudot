import type { ReactNode } from "react";

// Type describing SEO metadata for each route
type Metas = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  children?: ReactNode;
};

// List of SEO data for each route
export const seoDatas: Array<{
  path: string;
  title: string;
  description: string;
}> = [
  {
    path: "/",
    title: "Weeb - Explorez le Web sous toutes ces facettes",
    description:
      "Le monde du web évolue constamment, et nous sommes là pour vous guider à travers ses tendances, technologies et meilleures pratiques.",
  },
  {
    path: "/contact",
    title: "Nous contacter - Weeb",
    description: "Contactez notre équipe pour en savoir plus.",
  },
  {
    path: "/login",
    title: "Connexion - Weeb",
    description: "Connectez-vous à votre compte Weeb en un clin d'oeil.",
  },
];

export const BASE_URL = import.meta.env.DEV
  ? "http://localhost:5173"
  : "https://weeb.fr";

export const routeMetas: Record<string, Metas> = Object.fromEntries(
  seoDatas.map(({ path, title, description }) => {
    const fullUrl = `${BASE_URL}${path}`;
    const ogImage = `${BASE_URL}/cover.png`;

    // Default SEO tags
    const defaultChildren = (
      <>
        {/* Canonical */}
        <link rel="canonical" href={fullUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
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
        // Noindex meta tag to prevent search engines from indexing the contact page
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
