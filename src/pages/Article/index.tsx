import { use, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import DOMPurify from "dompurify";
import axios from "axios";
import img from "../../assets/img.webp";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { deletePost, getPostPromise } from "../../data/articles";
import { getCategoryColor } from "../../data/categories";

// Page de détail d'un article
const Article = () => {
  // Récupération du slug depuis l'URL
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Suspend à la première navigation vers un slug, puis résout depuis le cache.
  const article = use(getPostPromise(slug ?? ""));

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Le HTML vient du RichTextEditor (TipTap) — assaini avant rendu pour neutraliser
  // tout XSS qu'un auteur authentifié aurait pu glisser dans la requête API.
  const safeContent = useMemo(
    () => (article?.content ? DOMPurify.sanitize(article.content) : ""),
    [article?.content]
  );

  const handleDelete = async () => {
    if (!article || isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deletePost(article.slug);
      navigate("/articles");
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.status === 403
          ? "Vous n'êtes pas autorisé à supprimer cet article."
          : "La suppression a échoué. Veuillez réessayer.";
      setDeleteError(message);
      setIsDeleting(false);
    }
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setDeleteError(null);
  };

  // Page 404 si article non trouvé
  if (!article) {
    return (
      <section className="text-white py-10 pt-40 px-10 xl:px-0">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Article non trouvé</h1>
          <button
            onClick={() => navigate("/articles")}
            className="cursor-pointer text-secondary hover:underline transition-colors"
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
            className="cursor-pointer hover:text-secondary hover:underline transition-colors"
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
              article.categoryKey
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
          <span>
            Par{" "}
            {article.isOwner
              ? `Moi${article.author ? ` (${article.author})` : ""}`
              : article.author || "Rédaction"}
          </span>
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
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </figure>

        {/* Contenu de l'article */}
        {safeContent ? (
          <div
            className="prose prose-invert prose-lg max-w-none prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-justify prose-headings:text-white prose-strong:text-white prose-a:text-secondary prose-blockquote:border-secondary prose-blockquote:text-gray-300"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
        ) : (
          <p className="text-gray-300 leading-relaxed mb-6 text-justify text-lg tracking-wide">
            {article.summary}
          </p>
        )}

        <div className="my-12 border-t border-gray-700"></div>

        {/* Actions : retour, suppression (propriétaire) et partage */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/articles")}
            className="flex items-center gap-2 cursor-pointer text-secondary hover:underline transition-colors"
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

          {article.isOwner && (
            <div className="flex gap-4 items-center">
              <Button
                type="button"
                primary
                compact
                disabled={isDeleting}
                onClick={() => navigate(`/articles/${article.slug}/edit`)}
                text="Modifier"
              />
              <Button
                type="button"
                destructive
                compact
                disabled={isDeleting}
                onClick={() => setConfirmOpen(true)}
                text={isDeleting ? "Suppression..." : "Supprimer"}
              />
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer l'article"
        message="Cette action est irréversible. L'article sera définitivement retiré du site."
        confirmLabel={isDeleting ? "Suppression..." : "Supprimer"}
        cancelLabel="Annuler"
        destructive
        pending={isDeleting}
        errorMessage={deleteError ?? undefined}
        onConfirm={handleDelete}
        onCancel={closeConfirm}
      />
    </article>
  );
};

export default Article;
