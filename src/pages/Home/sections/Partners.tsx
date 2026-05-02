import logoSf from "../../../assets/logos/logo_smart_finder.webp";
import logoA from "../../../assets/logos/logo_artvenue.webp";
import logoS from "../../../assets/logos/logo_shells.webp";
import logoW from "../../../assets/logos/logo_waves.webp";
import logoZ from "../../../assets/logos/logo_zoomerr.webp";

// Section partenaires avec logos
const Partners = () => {
  return (
    <section className="text-white py-20 px-10 xl:px-0">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center gap-14">
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-wide leading-15 md:leading-20">
          Ils nous font confiance
        </h2>

        {/* Grille de logos partenaires */}
        <div className="grid grid-cols-2 gap-10 place-items-center lg:flex lg:flex-row lg:justify-center lg:items-center lg:gap-10">
          <img
            src={logoSf}
            alt="Logo de SmartFinder"
            className="size-auto w-auto"
            width={177}
            height={32}
            loading="lazy"
            decoding="async"
          />
          <img
            src={logoZ}
            alt="Logo de Zoomerr"
            className="size-auto w-auto"
            width={134}
            height={32}
            loading="lazy"
            decoding="async"
          />
          <img
            src={logoS}
            alt="Logo de Shells"
            className="size-auto w-auto"
            width={126}
            height={32}
            loading="lazy"
            decoding="async"
          />
          <img
            src={logoW}
            alt="Logo de Waves"
            className="size-auto w-auto"
            width={110}
            height={32}
            loading="lazy"
            decoding="async"
          />
          <img
            src={logoA}
            alt="Logo de ArtVenue"
            className="size-auto w-auto col-span-2 lg:col-span-1"
            width={167}
            height={32}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};

export default Partners;
