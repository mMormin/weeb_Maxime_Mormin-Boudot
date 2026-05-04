import { use } from "react";
import { Navigate, useParams } from "react-router";
import ArticleForm from "../../components/form/ArticleForm";
import { getPostPromise } from "../../data/articles";
import { useAuth } from "../../utils/auth";

// Page d'édition d'un article (réservée à l'auteur de l'article).
//
// `isOwner` est calculé côté API à partir du JWT : il couvre à la fois le
// cas non authentifié et le cas "authentifié mais pas l'auteur". On garde
// néanmoins une redirection vers /login quand le token est absent pour
// éviter un aller-retour vers le détail.
const EditArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const authenticated = useAuth();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // `use()` après l'early-return non-auth : volontaire, on ne suspend
  // que pour les utilisateurs authentifiés. React 19 autorise un appel
  // conditionnel à `use` dès lors que l'ordre des autres hooks est stable.
  const article = use(getPostPromise(slug ?? ""));

  // Article supprimé / slug inconnu → on renvoie vers la liste.
  if (!article) {
    return <Navigate to="/articles" replace />;
  }

  // Garde-fou côté client : un utilisateur authentifié non propriétaire
  // serait de toute façon rejeté en 403 par l'API au moment du PATCH.
  if (!article.isOwner) {
    return <Navigate to={`/articles/${article.slug}`} replace />;
  }

  return (
    <section className="text-white py-10 pt-30 px-10 xl:px-0">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide leading-tight mb-8 text-center">
          Modifier l'article
        </h1>

        <div className="bg-[#21223F] rounded-2xl p-6 md:p-8">
          <ArticleForm article={article} />
        </div>
      </div>
    </section>
  );
};

export default EditArticle;
