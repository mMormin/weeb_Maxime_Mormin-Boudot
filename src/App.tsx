import Header from "./components/layout/Header";
import { Outlet, useLocation } from "react-router";
import "./index.css";
import Footer from "./components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { routeMetas } from "./utils/routeMetas";

// Layout principal avec gestion SEO dynamique
function App() {
  const location = useLocation();

  // Récupère les métadonnées SEO selon la route actuelle
  const meta = routeMetas[location.pathname] ?? {
    title: "Weeb - Explorez le Web",
    description: "Explorez le Web sous toutes ces facettes.",
    children: null,
  };

  return (
    <>
      {/* Balises SEO dynamiques */}
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        {meta.children}
      </Helmet>

      <div className="font-roboto bg-primary">
        <Header />

        {/* Contenu de la page (injecté via React Router) */}
        <main className="bg-primary">
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
