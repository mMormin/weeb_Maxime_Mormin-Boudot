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
  {
    path: "/articles/new",
    title: "Nouvel article - Weeb",
    description: "Rédigez et publiez un nouvel article sur Weeb.",
  },
];

// URL de base selon l'environnement (dev/prod)
export const BASE_URL = "https://weeb.fr";
