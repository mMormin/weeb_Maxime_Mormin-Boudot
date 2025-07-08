import image from "../../../assets/image02.png";
import ArrowLink from "../../../components/ui/ArrowLink";

const Ressources = () => {
  return (
    <section className="text-white py-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="space-y-6">
          <p className="font-bold uppercase tracking-[3px]">
            Des ressources pour tous les niveaux
          </p>

          <h2 className="text-large font-extrabold tracking-wide leading-20 text-secondary">
            Apprenez <span className="text-white">et</span> <br />
            Progressez
          </h2>

          <p className="text-lg tracking-wide">
            Que vous débutiez en développement web ou que vous soyez un expert
            cherchant à approfondir vos connaissances, nous vous proposons des
            tutoriels, guides et bonnes pratiques pour apprendre efficacement.
          </p>

          <ArrowLink to="/ressources" text="Explorer les ressources" />
        </div>

        <img src={image} alt="Illustration" className="" />
      </div>
    </section>
  );
};

export default Ressources;
