import ArrowLink from "../../../components/ui/ArrowLink";
import shapes from "../../../assets/shapes.svg";
import { useMediaQuery } from "../../../utils/mediaQuery";
import Button from "../../../components/ui/Button";

const Articles = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <section className="text-white py-20 px-10 md:px-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-28">
        <div className="px-10 md:px-0">
          <img
            src={shapes}
            alt="Description du SVG"
            className="size-auto md:w-[416px]"
          />
        </div>

        <div className="space-y-6">
          <p className="font-bold uppercase tracking-[3px]">
            Le web, un écosystème en constante évolution
          </p>

          <h2 className="text-6xl md:text-large font-extrabold tracking-wide leading-16 md:leading-20 text-secondary">
            Restez informé des <br />
            dernières <span className="text-white">tendances</span>
          </h2>

          <p className="text-lg tracking-wide text-justify md:text-left">
            Chaque semaine, nous analysons les nouveautés du web : frameworks
            émergents, bonnes pratiques SEO, accessibilité, et bien plus encore.
            Ne manquez aucune actualité du digital !
          </p>

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
