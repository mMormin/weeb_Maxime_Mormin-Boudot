import type { ReactNode } from "react";

// Type décrivant les métadonnées SEO pour chaque route
type Metas = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  children?: ReactNode;
};

// Données SEO pour chaque route de l'application
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
  {
    path: "/articles",
    title: "Articles - Weeb",
    description:
      "Découvrez nos articles sur le développement web, les technologies et les meilleures pratiques.",
  },
];

// URL de base selon l'environnement (dev/prod)
export const BASE_URL = import.meta.env.DEV
  ? "http://localhost:5173"
  : "https://weeb.fr";

// Génère les métadonnées SEO pour chaque route
export const routeMetas: Record<string, Metas> = Object.fromEntries(
  seoDatas.map(({ path, title, description }) => {
    const fullUrl = `${BASE_URL}${path}`;
    const ogImage = `${BASE_URL}/cover.png`;

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
