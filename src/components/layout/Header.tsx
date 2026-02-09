import { useEffect, useState } from "react";
import { Link } from "react-router";
import Button from "../ui/Button";
import { Menu, X } from "lucide-react";
import { useMediaQuery } from "../../utils/mediaQuery";

// Header responsive avec navigation desktop et mobile
const Header = () => {
  // Détecte si l'utilisateur a scrollé (pour style condensé)
  const [isScrolled, setIsScrolled] = useState(false);
  // Contrôle l'ouverture du menu mobile
  const [menuOpen, setMenuOpen] = useState(false);

  // Détection du breakpoint mobile (≤1024px)
  const isMobile = useMediaQuery("(max-width: 1024px)");

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
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="hover:underline"
            >
              A propos
            </Link>

            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="hover:underline"
            >
              Nous contacter
            </Link>

            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="hover:underline"
            >
              Se connecter
            </Link>

            <Button
              to="/signup"
              primary
              text="Rejoindre maintenant"
              onClick={() => setMenuOpen(false)}
            />
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
            <Link to="/about" className="hover:underline ">
              A propos
            </Link>

            <Link to="/contact" className="hover:underline">
              Nous contacter
            </Link>
          </div>
        </div>

        {/* Actions utilisateur */}
        <div className="flex space-x-6 items-center justify-center">
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
