import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import Home from "./pages/Home/index";
import RouteBoundary, {
  RouteFallback,
} from "./components/layout/RouteBoundary";
import "./index.css";

// Routes secondaires chargées à la demande pour réduire le bundle initial
const Contact = lazy(() => import("./pages/Contact/index"));
const Login = lazy(() => import("./pages/Login/index"));
const Signup = lazy(() => import("./pages/Signup/index"));
const Articles = lazy(() => import("./pages/Articles"));
const Article = lazy(() => import("./pages/Article"));
const CreateArticle = lazy(() => import("./pages/CreateArticle"));

// Point d'entrée de l'application React
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Provider pour la gestion SEO */}
    <HelmetProvider>
      <BrowserRouter>
        {/* Configuration des routes */}
        <RouteBoundary>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="contact" element={<Contact />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="articles" element={<Articles />} />
                <Route path="articles/new" element={<CreateArticle />} />
                <Route path="articles/:slug" element={<Article />} />
              </Route>
            </Routes>
          </Suspense>
        </RouteBoundary>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
