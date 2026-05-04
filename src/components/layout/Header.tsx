import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Button from "../ui/Button";
import { LogOut, Menu, X } from "lucide-react";
import { useMediaQuery } from "../../utils/mediaQuery";
import { clearTokens, useAuth } from "../../utils/auth";
import { useUsername } from "../../data/users";

// Header responsive avec navigation desktop et mobile
const Header = () => {
  // Détecte si l'utilisateur a scrollé (pour style condensé)
  const [isScrolled, setIsScrolled] = useState(false);
  // Contrôle l'ouverture du menu mobile
  const [menuOpen, setMenuOpen] = useState(false);

  // Détection du breakpoint mobile (≤1024px)
  const isMobile = useMediaQuery("(max-width: 1024px)");

  // État d'authentification (réactif aux changements de tokens)
  const authenticated = useAuth();
  // Username courant (réactif). Vide tant que l'utilisateur n'a pas publié
  // son premier article (la modal n'a pas encore été déclenchée).
  const username = useUsername();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    setMenuOpen(false);
    navigate("/");
  };

  // Écoute du scroll pour déclencher le style condensé
  useEffect(() => {
    if (isMobile) return;

    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  // Version mobile du header
  if (isMobile) {
    return (
      <>
        {/* Barre de navigation fixe mobile */}
        <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-[#1B2334] to-[#181F2C] px-6 p-4 z-50 flex justify-between items-center shadow rounded-b-xl">
          <Link to="/">
            <span className="text-4xl font-bold text-white tracking-wide">
              weeb
            </span>
          </Link>

          {/* Bouton hamburger */}
          <button
            aria-label="Ouvrir le menu"
            className="text-white text-3xl bg-purple-600 p-2 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="size-10" />
          </button>
        </header>

        {/* Menu plein écran mobile */}
        {menuOpen && (
          <div className="fixed inset-0 bg-[#1B2334] bg-opacity-95 z-60 flex flex-col items-center justify-center space-y-10 text-white text-2xl">
            {/* Bouton fermeture */}
            <button
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="text-white text-3xl bg-purple-600 p-2 rounded-lg fixed top-4 right-6"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="size-10 " />
              ) : (
                <Menu className="size-10" />
              )}
            </button>

            {/* Liens de navigation */}
            {/* Placeholder : route "A propos" pas encore implémentée. */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
              }}
              className="hover:underline"
            >
              A propos
            </a>

            <Link
              to="/articles"
              onClick={() => setMenuOpen(false)}
              className="hover:underline"
            >
              Blog
            </Link>

            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="hover:underline"
            >
              Nous contacter
            </Link>

            {authenticated && username && (
              <span className="text-secondary font-semibold">{username}</span>
            )}

            {authenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="hover:underline"
              >
                Se déconnecter
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="hover:underline"
              >
                Se connecter
              </Link>
            )}

            {!authenticated && (
              <Button
                to="/signup"
                primary
                text="Rejoindre maintenant"
                onClick={() => setMenuOpen(false)}
              />
            )}
          </div>
        )}
      </>
    );
  }

  // Version desktop du header
  return (
    <header
      className={`fixed left-0 right-0 z-50 ${
        !isScrolled
          ? "top-0 bg-gradient-to-r from-[#1A2232] to-[#1B2234] shadow-md px-10"
          : "top-5 transition-top duration-100"
      }`}
    >
      {/* Navigation avec style condensé au scroll */}
      <nav
        className={`mx-auto flex justify-between items-center space-x-6 ${
          isScrolled
            ? "min-w-[700px] w-[50vw] rounded-lg h-[76px] shadow-md bg-gradient-to-r from-[#1A2232] to-[#1B2234] px-5"
            : "w-full py-4"
        }`}
      >
        {/* Logo et liens principaux */}
        <div className="flex justify-center items-center">
          <Link to="/">
            <span className="text-3xl font-bold text-white mr-12">weeb</span>
          </Link>

          <div className="flex space-x-6 mt-1 text-white">
            {/* Placeholder : route "A propos" pas encore implémentée. */}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="hover:underline "
            >
              A propos
            </a>

            <Link to="/articles" className="hover:underline">
              Blog
            </Link>

            <Link to="/contact" className="hover:underline">
              Nous contacter
            </Link>
          </div>
        </div>

        {/* Actions utilisateur */}
        <div className="flex space-x-6 items-center justify-center">
          {authenticated && username && (
            <span className="text-secondary font-semibold">{username}</span>
          )}

          {authenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors cursor-pointer"
            >
              <LogOut className="size-5" />
              Se déconnecter
            </button>
          ) : (
            <>
              <Link to="/login" className="text-white hover:underline">
                Se connecter
              </Link>

              <Button
                to="/signup"
                primary
                text="Rejoindre maintenant"
                compact
                reverseAnimation
              />
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
