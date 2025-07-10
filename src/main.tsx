import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import Home from "./pages/Home/index";
import Contact from "./pages/Contact/index";
import Login from "./pages/Login/index";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
