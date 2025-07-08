import Button from "../../../components/ui/Button";
import image from "../../../assets/image.png";

const Intro = () => {
  return (
    <section className="text-white py-10 pt-40">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center gap-15">
        <div>
          <h1 className="text-large font-extrabold tracking-wide leading-20">
            Explorez le <span className="font-light text-secondary">Web</span>{" "}
            sous toutes
            <br />
            ses{" "}
            <span className="underline underline-offset-10 decoration-[4px] decoration-secondary">
              facettes
            </span>
          </h1>

          <p className="text-xl leading-8 tracking-wide my-10">
            Le monde du web évolue constamment, et nous sommes là pour vous
            guider à travers ses tendances, technologies et meilleures
            pratiques. Que vous soyez développeur, designer ou passionné du
            digital, notre blog vous offre du contenu de qualité pour rester à
            la pointe.
          </p>

          <div className="flex justify-center items-center gap-6">
            <Button primary text="Découvrir les articles" to="/articles" />

            <Button text="S'abonner à la newsletter" to="/newsletter" />
          </div>
        </div>

        <img src={image} alt="Illustration" className="w-full" />
      </div>
    </section>
  );
};

export default Intro;
