import ArrowLink from "../../../components/ui/ArrowLink";
import shapes from "../../../assets/shapes.svg";

const Articles = () => {
  return (
    <section className="text-white py-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-28">
        <div>
          <img
            src={shapes}
            alt="Description du SVG"
            className="size-auto max-w-[416px]"
          />
        </div>

        <div className="space-y-6">
          <p className="font-bold uppercase tracking-[3px]">
            Le web, un écosystème en constante évolution
          </p>

          <h2 className="text-large font-extrabold tracking-wide leading-20 text-secondary">
            Restez informé des <br />
            dernières <span className="text-white">tendances</span>
          </h2>

          <p className="text-lg tracking-wide">
            Chaque semaine, nous analysons les nouveautés du web : frameworks
            émergents, bonnes pratiques SEO, accessibilité, et bien plus encore.
            Ne manquez aucune actualité du digital !
          </p>

          <ArrowLink to="/articles" text="Lire les articles récents" />
        </div>
      </div>
    </section>
  );
};

export default Articles;
