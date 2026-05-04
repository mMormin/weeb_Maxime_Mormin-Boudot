import Button from "../../../components/ui/Button";
import imageSm from "../../../assets/image-600.webp";
import imageLg from "../../../assets/image-1100.webp";

// Section héro avec titre principal et CTA
const Intro = () => {
  return (
    <section className="text-white py-10 pt-40 px-10 xl:px-0">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center gap-15">
        <div>
          {/* Titre principal avec mise en avant */}
          <h1 className="text-6xl md:text-large font-extrabold tracking-wide leading-16 md:leading-20">
            Explorez le{" "}
            <span className="font-extrabold text-secondary">Web</span> sous
            toutes
            <br />
            ses{" "}
            <span className="underline underline-offset-10 decoration-[4px] decoration-secondary">
              facettes
            </span>
          </h1>

          {/* Description du site */}
          <p className="md:text-xl text-lg md:leading-8 tracking-wide my-10 text-justify md:text-center">
            Le monde du web évolue constamment, et nous sommes là pour vous
            guider à travers ses tendances, technologies et meilleures
            pratiques. Que vous soyez développeur, designer ou passionné du
            digital, notre blog vous offre du contenu de qualité pour rester à
            la pointe.
          </p>

          {/* Boutons d'action */}
          <div className="flex justify-center items-center gap-6">
            <Button primary text="Découvrir les articles" to="/articles" />
            <Button text="S'abonner à la newsletter" to="#" />
          </div>
        </div>

        {/* Illustration principale */}
        <img
          src={imageLg}
          srcSet={`${imageSm} 600w, ${imageLg} 1100w`}
          sizes="(max-width: 768px) 100vw, 1100px"
          alt="Illustration d'un navigateur"
          className="size-auto max-w-[1100px] w-full"
          width={1100}
          height={730}
          fetchPriority="high"
          decoding="async"
        />
      </div>
    </section>
  );
};

export default Intro;
