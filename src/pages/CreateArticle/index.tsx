import { Navigate } from "react-router";
import CreateArticleForm from "../../components/form/CreateArticleForm";
import { useAuth } from "../../utils/auth";

// Page de création d'un article (réservée aux utilisateurs authentifiés)
const CreateArticle = () => {
  const authenticated = useAuth();

  // Garde-fou : redirige vers la connexion si non authentifié.
  // L'API rejetterait de toute façon la requête en 401, mais cette redirection
  // évite d'afficher un formulaire inutile.
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="text-white py-10 pt-30 px-10 xl:px-0">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-wide leading-16 lg:leading-20 mb-10 text-center">
          Nouvel article
        </h1>

        <div className="bg-[#21223F] rounded-2xl p-8 md:p-12">
          <CreateArticleForm />
        </div>
      </div>
    </section>
  );
};

export default CreateArticle;
