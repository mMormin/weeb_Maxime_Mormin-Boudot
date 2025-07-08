import { useEffect, useState } from "react";
import { Link } from "react-router";
import Button from "../ui/Button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 z-50 ${
        !isScrolled
          ? "top-0 bg-gradient-to-r from-[#1A2232] to-[#1B2234] shadow-md px-10"
          : "top-5 transition-top duration-100"
      }`}
    >
      <nav
        className={`mx-auto flex justify-between items-center space-x-6 ${
          isScrolled
            ? "w-[50vw] rounded-lg h-[76px] shadow-md bg-gradient-to-r from-[#1A2232] to-[#1B2234] px-5"
            : "w-full py-4"
        }`}
      >
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

        <div className="flex space-x-6 items-center justify-center">
          <Link to="/login" className="text-white hover:underline">
            Se connecter
          </Link>

          <Button to="/signup" primary text="Rejoindre maintenant" compact />
        </div>
      </nav>
    </header>
  );
};

export default Header;
