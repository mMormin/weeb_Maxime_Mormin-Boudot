import logoSf from "../../../assets/logos/logo_smart_finder.png";
import logoA from "../../../assets/logos/logo_artvenue.png";
import logoS from "../../../assets/logos/logo_shells.png";
import logoW from "../../../assets/logos/logo_waves.png";
import logoZ from "../../../assets/logos/logo_zoomerr.png";

const Partners = () => {
  return (
    <section className="text-white py-20 px-10 md:px-0">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center gap-14">
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-wide leading-15 md:leading-20">
          Ils nous font confiance
        </h2>

        <div className="grid grid-cols-2 gap-10 place-items-center md:flex md:flex-row md:justify-center md:items-center md:gap-10">
          <img
            src={logoSf}
            alt="Logo de SmartFinder"
            className="size-auto w-auto"
          />

          <img src={logoZ} alt="Logo de Zoomerr" className="size-auto w-auto" />

          <img src={logoS} alt="Logo de Shells" className="size-auto w-auto" />

          <img src={logoW} alt="Logo de Waves" className="size-auto w-auto" />

          <img
            src={logoA}
            alt="Logo de ArtVenue"
            className="size-auto w-auto col-span-2 md:col-span-1"
          />
        </div>
      </div>
    </section>
  );
};

export default Partners;
