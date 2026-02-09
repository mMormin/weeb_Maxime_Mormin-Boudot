import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import Home from "./pages/Home/index";
import Contact from "./pages/Contact/index";
import Login from "./pages/Login/index";
import "./index.css";
import Articles from "./pages/Articles";
import Article from "./pages/Article";

// Point d'entrée de l'application React
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Provider pour la gestion SEO */}
    <HelmetProvider>
      <BrowserRouter>
        {/* Configuration des routes */}
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="articles" element={<Articles />} />
            <Route path="articles/:slug" element={<Article />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
