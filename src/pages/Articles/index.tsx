import img from "../../assets/img.jpg";
import { useNavigate } from "react-router";
import { articles, getArticleSlug } from "../../data/articles";
import { getCategoryColor } from "../../utils/categoryColors";

// Retourne les classes CSS de grille selon la taille de l'article
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

// Page listant tous les articles en grille
const Articles = () => {
  const navigate = useNavigate();

  return (
    <section className="text-white py-10 pt-30 px-10 xl:px-0">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-wide leading-16 lg:leading-20 mb-5">
          Articles
        </h1>

        {/* Grille d'articles responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-2">
          {articles.map((article) => (
            <div
              key={article.id}
              onClick={() => navigate(`/articles/${getArticleSlug(article)}`)}
              className={`bg-gray-800/50 rounded-lg overflow-hidden shadow hover:shadow-xl min-h-56 transition-all duration-300 flex flex-col cursor-pointer group hover:scale-102 ${getArticleSpan(
                article.size
              )} ${article.size === "large" ? "p-6" : ""}`}
            >
              {/* Titre pour article large (au-dessus de l'image) */}
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

              {/* Image de couverture */}
              <img
                src={img}
                alt={article.title}
                className={`w-full object-cover ${
                  article.size === "large" ? "h-64 lg:h-96" : "h-48"
                }`}
              />

              {/* Contenu pour articles small/medium */}
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
                      {/* Badge catégorie */}
                      <span
                        className={`inline-block w-4 h-4 rounded mr-2 pt-3 border-black border-2 ${getCategoryColor(
                          article.category
                        )}`}
                      ></span>
                      {article.title}
                    </h2>

                    {/* Résumé pour articles medium */}
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
                  {/* Date et résumé pour article large */}
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
