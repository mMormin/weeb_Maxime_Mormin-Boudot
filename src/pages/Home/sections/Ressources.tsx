import image from "../../../assets/image02.png";
import ArrowLink from "../../../components/ui/ArrowLink";
import Button from "../../../components/ui/Button";
import { useMediaQuery } from "../../../utils/mediaQuery";

// Section ressources avec CTA adaptatif mobile/desktop
const Ressources = () => {
  // Détection du breakpoint mobile
  const isMobile = useMediaQuery("(max-width: 1024px)");

  return (
    <section className="text-white py-20 px-10 xl:px-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="space-y-6">
          {/* Sous-titre */}
          <p className="font-bold uppercase tracking-[3px]">
            Des ressources pour tous les niveaux
          </p>

          {/* Titre principal */}
          <h2 className="text-6xl lg:text-large font-extrabold tracking-wide leading-16 lg:leading-20 text-secondary">
            Apprenez <span className="text-white">et</span>{" "}
            <span className="hidden lg:inline">
              <br />
            </span>
            Progressez
          </h2>

          {/* Description */}
          <p className="text-lg tracking-wide text-justify lg:text-left">
            Que vous débutiez en développement web ou que vous soyez un expert
            cherchant à approfondir vos connaissances, nous vous proposons des
            tutoriels, guides et bonnes pratiques pour apprendre efficacement.
          </p>

          {/* Image visible uniquement sur mobile */}
          <div className="lg:hidden flex justify-center items-center">
            <img
              src={image}
              alt="Illustration d'un navigateur"
              className="size-auto w-auto max-w-[80%]"
            />
          </div>

          {/* CTA : Bouton sur mobile, lien flèche sur desktop */}
          {isMobile ? (
            <div className="flex justify-center items-center mt-10">
              <Button text="Explorer les ressources" to="/ressources" primary />
            </div>
          ) : (
            <ArrowLink to="/ressources" text="Explorer les ressources" />
          )}
        </div>

        {/* Image visible uniquement sur desktop */}
        <img
          src={image}
          alt="Illustration d'un navigateur"
          className="size-auto w-auto hidden lg:block"
        />
      </div>
    </section>
  );
};

export default Ressources;
