import { use } from "react";
import { useParams, useNavigate } from "react-router";
import img from "../../assets/img.webp";
import { getPostPromise } from "../../data/articles";
import { getCategoryColor } from "../../utils/categoryColors";

// Page de détail d'un article
const Article = () => {
  // Récupération du slug depuis l'URL
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Suspends on first navigation to a slug, then resolves from cache.
  const article = use(getPostPromise(slug ?? ""));

  // Page 404 si article non trouvé
  if (!article) {
    return (
      <section className="text-white py-10 pt-40 px-10 xl:px-0">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Article non trouvé</h1>
          <button
            onClick={() => navigate("/articles")}
            className="text-secondary hover:underline"
          >
            Retour aux articles
          </button>
        </div>
      </section>
    );
  }

  return (
    <article className="text-white py-10 pt-40 px-10 xl:px-0">
      <div className="max-w-4xl mx-auto">
        {/* Fil d'ariane */}
        <nav className="mb-8 text-sm text-gray-400">
          <button
            onClick={() => navigate("/articles")}
            className="hover:text-secondary transition-colors"
          >
            Articles
          </button>
          <span className="mx-2">/</span>
          <span className="text-white">{article.title}</span>
        </nav>

        {/* Badge catégorie */}
        <div className="mb-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded text-sm font-semibold text-white ${getCategoryColor(
              article.category
            )}`}
          >
            <span className={`w-2 h-2 rounded-full bg-white mr-2`}></span>
            {article.category}
          </span>
        </div>

        {/* Titre de l'article */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
          {article.title}
        </h1>

        {/* Résumé */}
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8 font-light">
          {article.summary}
        </p>

        {/* Métadonnées : auteur, date, temps de lecture */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-700">
          <span>Par {article.author || "Rédaction"}</span>
          <span>•</span>
          <time>{article.date}</time>
          {article.readTime && (
            <>
              <span>•</span>
              <span>{article.readTime} de lecture</span>
            </>
          )}
        </div>

        {/* Image principale */}
        <figure className="mb-12">
          <img
            src={img}
            alt={article.title}
            className="w-full h-auto rounded-lg object-cover"
            width={1344}
            height={768}
            fetchPriority="high"
            decoding="async"
          />
          <figcaption className="text-sm text-gray-400 mt-3 text-center italic">
            Illustration de l'article
          </figcaption>
        </figure>

        {/* Contenu de l'article */}
        <div className="prose prose-invert prose-lg max-w-none">
          {article.content ? (
            article.content.map((paragraph, index) => (
              <p
                key={index}
                className="text-gray-300 leading-relaxed mb-6 text-justify text-lg tracking-wide"
              >
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-gray-300 leading-relaxed mb-6 text-justify text-lg tracking-wide">
              {article.summary}
            </p>
          )}
        </div>

        <div className="my-12 border-t border-gray-700"></div>

        {/* Actions : retour et partage */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/articles")}
            className="flex items-center gap-2 text-secondary hover:underline transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Retour aux articles
          </button>

          {/* Bouton de partage */}
          <div className="flex gap-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Article;
