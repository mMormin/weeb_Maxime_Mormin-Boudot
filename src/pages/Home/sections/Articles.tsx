import ArrowLink from "../../../components/ui/ArrowLink";
import shapes from "../../../assets/shapes.svg";
import { useMediaQuery } from "../../../utils/mediaQuery";
import Button from "../../../components/ui/Button";

// Section articles récents avec CTA adaptatif
const Articles = () => {
  // Détection du breakpoint mobile
  const isMobile = useMediaQuery("(max-width: 1024px)");

  return (
    <section className="text-white py-20 px-10 xl:px-0">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-20 xl:gap-28">
        {/* Illustration décorative */}
        <div className="px-10 xl:px-0 flex justify-center">
          <img
            src={shapes}
            alt=""
            aria-hidden="true"
            className="size-auto max-w-[50%] xl:max-w-full xl:w-[416px]"
            width={416}
            height={416}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="space-y-6">
          {/* Sous-titre */}
          <p className="font-bold uppercase tracking-[3px]">
            Le web, un écosystème en constante évolution
          </p>

          {/* Titre principal */}
          <h2 className="text-6xl lg:text-large font-extrabold tracking-wide leading-16 lg:leading-20 text-secondary">
            Restez informé des{" "}
            <span className="hidden xl:inline-block">
              <br />
            </span>
            dernières <span className="text-white">tendances</span>
          </h2>

          {/* Description */}
          <p className="text-lg tracking-wide text-justify lg:text-left">
            Chaque semaine, nous analysons les nouveautés du web : frameworks
            émergents, bonnes pratiques SEO, accessibilité, et bien plus encore.
            Ne manquez aucune actualité du digital !
          </p>

          {/* CTA : Bouton sur mobile, lien flèche sur desktop */}
          {isMobile ? (
            <div className="flex justify-center items-center mt-10">
              <Button text="Lire les articles récents" to="/articles" primary />
            </div>
          ) : (
            <ArrowLink to="/articles" text="Lire les articles récents" />
          )}
        </div>
      </div>
    </section>
  );
};

export default Articles;
