import img from "../../assets/img.jpg";

interface Article {
  id: number;
  title: string;
  date: string;
  image: string;
  summary: string;
  category: string;
  size?: "small" | "medium" | "large";
}

const articles: Article[] = [
  {
    id: 1,
    title:
      "Les tendances du web en 2025 : Une révolution technologique à venir",
    date: "3 novembre 2025",
    image: "/assets/img.jpg",
    summary:
      "Découvrez les technologies qui façonneront l'avenir du développement web cette année. Avec l'avènement de l'IA, des frameworks plus performants et des standards web évolutifs, les développeurs doivent s'adapter à un écosystème en constante mutation. Cet article explore en détail les innovations clés, telles que les API modernes, les outils de collaboration et les pratiques de développement durable, pour vous aider à rester à la pointe de la technologie.",
    category: "Technologie",
    size: "large",
  },
  {
    id: 2,
    title:
      "React 19 : Nouveautés et améliorations majeures pour les développeurs",
    date: "2 novembre 2025",
    image: "/assets/img.jpg",
    summary:
      "Un aperçu des nouvelles fonctionnalités de React 19 et leur impact sur les applications modernes.",
    category: "Développement",
    size: "medium",
  },
  {
    id: 3,
    title:
      "L'importance de l'accessibilité web : Clés pour une inclusion numérique",
    date: "1 novembre 2025",
    image: "/assets/img.jpg",
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
    image: "/assets/img.jpg",
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
    image: "/assets/img.jpg",
    summary:
      "Explorer les avancées récentes en CSS et leur adoption dans les navigateurs.",
    category: "CSS",
    size: "medium",
  },
  {
    id: 6,
    title: "Protéger vos applications contre les menaces modernes",
    date: "29 octobre 2025",
    image: "/assets/img.jpg",
    summary:
      "Les meilleures pratiques pour sécuriser vos sites web contre les menaces courantes.",
    category: "Sécurité",
    size: "small",
  },
  {
    id: 7,
    title: "TypeScript 5.0 : Les nouveautés qui changent tout",
    date: "28 octobre 2025",
    image: "/assets/img.jpg",
    summary:
      "Découvrez les améliorations majeures de TypeScript 5.0 et comment elles peuvent améliorer votre code.",
    category: "Développement",
    size: "small",
  },
  {
    id: 8,
    title: "Les tendances en UI/UX Design ne cessent d'évoluer !",
    date: "27 octobre 2025",
    image: "/assets/img.jpg",
    summary:
      "Les tendances en design d'interface et d'expérience utilisateur qui marquent l'année 2025.",
    category: "Design",
    size: "small",
  },
  {
    id: 9,
    title: "Node.js : Meilleures pratiques pour le backend",
    date: "26 octobre 2025",
    image: "/assets/img.jpg",
    summary:
      "Guide complet des meilleures pratiques pour développer des applications backend robustes avec Node.js.",
    category: "Développement",
    size: "small",
  },
  {
    id: 10,
    title: "Web3 et Blockchain : L'avenir du web décentralisé",
    date: "25 octobre 2025",
    image: "/assets/img.jpg",
    summary:
      "Comprendre les concepts du Web3 et comment la blockchain transforme Internet.",
    category: "Technologie",
    size: "small",
  },
  {
    id: 11,
    title: "Architecture Microservices : Guide pratique",
    date: "24 octobre 2025",
    image: "/assets/img.jpg",
    summary:
      "Comment concevoir et implémenter une architecture microservices efficace pour vos applications.",
    category: "Architecture",
    size: "small",
  },
  {
    id: 12,
    title: "Tests automatisés : Stratégies et outils",
    date: "23 octobre 2025",
    image: "/assets/img.jpg",
    summary:
      "Les meilleures stratégies et outils pour automatiser vos tests et garantir la qualité du code.",
    category: "Testing",
    size: "medium",
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Technologie":
      return "bg-red-500";
    case "Développement":
      return "bg-blue-500";
    case "Accessibilité":
      return "bg-green-500";
    case "Performance":
      return "bg-yellow-500";
    case "CSS":
      return "bg-purple-500";
    case "Sécurité":
      return "bg-orange-500";
    case "Design":
      return "bg-pink-500";
    case "Architecture":
      return "bg-indigo-500";
    case "Testing":
      return "bg-teal-500";
    default:
      return "bg-gray-500";
  }
};

const getArticleSpan = (size?: string) => {
  switch (size) {
    case "large":
      return "lg:col-span-3 lg:row-span-2";
    case "medium":
      return "lg:col-span-2";
    case "small":
    default:
      return "lg:col-span-1";
  }
};

const Articles = () => {
  return (
    <section className="text-white py-10 pt-30 px-10 xl:px-0">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-wide leading-16 lg:leading-20 mb-5">
          Articles
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-2">
          {articles.map((article) => (
            <div
              key={article.id}
              className={`bg-gray-800/50 rounded-lg overflow-hidden shadow hover:shadow-xl min-h-56 transition-all duration-300 flex flex-col cursor-pointer group hover:scale-102 ${getArticleSpan(
                article.size
              )} ${article.size === "large" ? "p-6" : ""}`}
            >
              {article.size === "large" && (
                <h2
                  className={`font-bold text-white tracking-wider pb-5 group-hover:underline underline-offset-4 ${
                    article.size === "large"
                      ? "text-2xl lg:text-3xl leading-8"
                      : "text-xl leading-6"
                  }`}
                >
                  <span
                    className={`inline-block w-5 h-5 rounded border-black border-2 mr-4 ${getCategoryColor(
                      article.category
                    )}`}
                  />
                  {article.title}
                </h2>
              )}

              <img
                src={img}
                alt={article.title}
                className={`w-full object-cover ${
                  article.size === "large" ? "h-64 lg:h-96" : "h-48"
                }`}
              />

              {article.size !== "large" ? (
                <div className="p-3 flex-1 justify-between flex flex-col gap-1">
                  <div>
                    <h2
                      className={`font-bold text-white tracking-wider group-hover:underline underline-offset-2 ${
                        article.size === "medium"
                          ? "text-xl leading-7"
                          : "text-lg leading-6"
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 rounded mr-2 pt-3 border-black border-2 ${getCategoryColor(
                          article.category
                        )}`}
                      ></span>
                      {article.title}
                    </h2>

                    {article.size === "medium" && (
                      <p className="text-gray-300 pt-3 line-clamp-1">
                        {article.summary}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 text-right">
                    {article.date}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-400 mt-2 text-right">
                    {article.date}
                  </p>

                  <p className="text-gray-300 leading-relaxed mt-3 tracking-wide">
                    {article.summary}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Articles;
