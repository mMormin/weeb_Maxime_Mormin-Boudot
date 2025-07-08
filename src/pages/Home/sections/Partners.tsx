import logoSf from "../../../assets/logos/logo_smart_finder.png";
import logoA from "../../../assets/logos/logo_artvenue.png";
import logoS from "../../../assets/logos/logo_shells.png";
import logoW from "../../../assets/logos/logo_waves.png";
import logoZ from "../../../assets/logos/logo_zoomerr.png";

const Partners = () => {
  return (
    <section className="text-white py-20">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center gap-14">
        <h2 className="text-6xl font-extrabold tracking-wide leading-20">
          Ils nous font confiance
        </h2>

        <div className="flex items-center justify-center gap-20">
          <img src={logoSf} alt="Illustration" className="w-full" />

          <img src={logoZ} alt="Illustration" className="w-full" />

          <img src={logoS} alt="Illustration" className="w-full" />

          <img src={logoW} alt="Illustration" className="w-full" />

          <img src={logoA} alt="Illustration" className="w-full" />
        </div>
      </div>
    </section>
  );
};

export default Partners;
