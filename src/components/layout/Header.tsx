import { Link } from "react-router";

const Header = () => {
  return (
    <header>
      <nav className="mb-4 space-x-4">
        <Link to="/" className="text-blue-600 hover:underline">
          Accueil
        </Link>
        <Link to="/login" className="text-blue-600 hover:underline">
          Connexion
        </Link>
        <Link to="/contact" className="text-blue-600 hover:underline">
          Contact
        </Link>
      </nav>
    </header>
  );
};

export default Header;
