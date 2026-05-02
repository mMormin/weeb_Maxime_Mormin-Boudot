// Interface définissant la structure d'un article
export interface Article {
  id: number;
  title: string;
  date: string;
  summary: string;
  category: string;
  size?: "small" | "medium" | "large";
  author?: string;
  readTime?: string;
  content?: string[];
}

// Génère un slug URL-friendly à partir d'un titre
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD") // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, "") // Garde lettres, chiffres, espaces, tirets
    .trim()
    .replace(/\s+/g, "-") // Remplace espaces par tirets
    .replace(/-+/g, "-"); // Évite les tirets multiples
};

// Retourne le slug d'un article
export const getArticleSlug = (article: Article): string => {
  return generateSlug(article.title);
};

// Données statiques des articles (mock)
export const articles: Article[] = [
  {
    id: 1,
    title:
      "Les tendances du web en 2025 : Une révolution technologique à venir",
    date: "3 novembre 2025",
    summary:
      "Découvrez les technologies qui façonneront l'avenir du développement web cette année. Avec l'avènement de l'IA, des frameworks plus performants et des standards web évolutifs, les développeurs doivent s'adapter à un écosystème en constante mutation. Cet article explore en détail les innovations clés, telles que les API modernes, les outils de collaboration et les pratiques de développement durable, pour vous aider à rester à la pointe de la technologie.",
    category: "Technologie",
    size: "large",
    author: "Maxime Mormin-Boudot",
    readTime: "8 min",
    content: [
      "Le monde du développement web est en constante évolution, et l'année 2025 marque un tournant décisif dans l'adoption de nouvelles technologies. Avec l'avènement de l'intelligence artificielle, des frameworks plus performants et des standards web évolutifs, les développeurs doivent s'adapter à un écosystème en constante mutation.",
      "Les API modernes transforment la façon dont nous construisons les applications. Les développeurs peuvent désormais créer des expériences utilisateur plus riches et plus interactives grâce à des technologies comme WebGPU, WebAssembly et les Progressive Web Apps.",
      "L'intelligence artificielle s'intègre de plus en plus dans les workflows de développement. Des outils comme GitHub Copilot et ChatGPT révolutionnent la manière dont nous écrivons du code, permettant aux développeurs de se concentrer sur la logique métier plutôt que sur la syntaxe.",
      "Les frameworks JavaScript continuent d'évoluer. React 19, Vue 3.4 et Svelte 5 apportent des améliorations significatives en termes de performance et de développeur experience. Ces frameworks adoptent de nouvelles approches pour la gestion d'état et le rendu côté serveur.",
      "La sécurité devient une priorité absolue. Avec l'augmentation des cyberattaques, les développeurs doivent adopter des pratiques de sécurité dès la conception. L'authentification forte, le chiffrement des données et la validation des entrées sont désormais des standards incontournables.",
      "Le développement durable prend de l'ampleur dans notre industrie. Les développeurs sont de plus en plus conscients de l'impact environnemental de leurs applications et cherchent à optimiser la consommation de ressources et l'efficacité énergétique de leurs solutions.",
    ],
  },
  {
    id: 2,
    title:
      "React 19 : Nouveautés et améliorations majeures pour les développeurs",
    date: "2 novembre 2025",
    summary:
      "Un aperçu des nouvelles fonctionnalités de React 19 et leur impact sur les applications modernes.",
    category: "Développement",
    size: "medium",
    author: "Maxime Mormin-Boudot",
    readTime: "6 min",
    content: [
      "React 19 arrive avec son lot de nouveautés qui vont transformer la façon dont nous développons des applications web. Cette version majeure apporte des améliorations significatives en termes de performance, de gestion d'état et de rendu côté serveur.",
      "Les nouveaux hooks améliorés permettent une gestion d'état plus intuitive et performante. Le support natif pour les composants asynchrones simplifie le code et améliore la lisibilité.",
      "Les optimisations internes du moteur de rendu réduisent considérablement les temps de chargement et améliorent l'expérience utilisateur globale.",
    ],
  },
  {
    id: 3,
    title:
      "L'importance de l'accessibilité web : Clés pour une inclusion numérique",
    date: "1 novembre 2025",
    summary:
      "Pourquoi l'accessibilité est essentielle et comment l'intégrer dans vos projets web.",
    category: "Accessibilité",
    size: "small",
  },
  {
    id: 4,
    title:
      "Optimisation des performances avec Vite : Accélérer vos applications web",
    date: "31 octobre 2025",
    summary:
      "Comment tirer parti de Vite pour des applications web ultra-rapides.",
    category: "Performance",
    size: "small",
  },
  {
    id: 5,
    title:
      "Le futur du CSS avec les nouvelles spécifications : Innovations et adoption",
    date: "30 octobre 2025",
    summary:
      "Explorer les avancées récentes en CSS et leur adoption dans les navigateurs.",
    category: "CSS",
    size: "medium",
  },
  {
    id: 6,
    title: "Protéger vos applications contre les menaces modernes",
    date: "29 octobre 2025",
    summary:
      "Les meilleures pratiques pour sécuriser vos sites web contre les menaces courantes.",
    category: "Sécurité",
    size: "small",
  },
  {
    id: 7,
    title: "TypeScript 5.0 : Les nouveautés qui changent tout",
    date: "28 octobre 2025",
    summary:
      "Découvrez les améliorations majeures de TypeScript 5.0 et comment elles peuvent améliorer votre code.",
    category: "Développement",
    size: "small",
  },
  {
    id: 8,
    title: "Les tendances en UI/UX Design ne cessent d'évoluer !",
    date: "27 octobre 2025",
    summary:
      "Les tendances en design d'interface et d'expérience utilisateur qui marquent l'année 2025.",
    category: "Design",
    size: "small",
  },
  {
    id: 9,
    title: "Node.js : Meilleures pratiques pour le backend",
    date: "26 octobre 2025",
    summary:
      "Guide complet des meilleures pratiques pour développer des applications backend robustes avec Node.js.",
    category: "Développement",
    size: "small",
  },
  {
    id: 10,
    title: "Web3 et Blockchain : L'avenir du web décentralisé",
    date: "25 octobre 2025",
    summary:
      "Comprendre les concepts du Web3 et comment la blockchain transforme Internet.",
    category: "Technologie",
    size: "small",
  },
  {
    id: 11,
    title: "Architecture Microservices : Guide pratique",
    date: "24 octobre 2025",
    summary:
      "Comment concevoir et implémenter une architecture microservices efficace pour vos applications.",
    category: "Architecture",
    size: "small",
  },
  {
    id: 12,
    title: "Tests automatisés : Stratégies et outils",
    date: "23 octobre 2025",
    summary:
      "Les meilleures stratégies et outils pour automatiser vos tests et garantir la qualité du code.",
    category: "Testing",
    size: "medium",
  },
];
