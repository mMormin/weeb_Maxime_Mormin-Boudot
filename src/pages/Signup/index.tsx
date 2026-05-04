import SignupForm from "../../components/form/SignupForm";
import Button from "../../components/ui/Button";

// Page d'inscription utilisateur
const Signup = () => {
  return (
    <section className="text-white py-40 px-10 xl:px-0">
      <div className="max-w-8xl mx-auto text-center flex flex-col items-center justify-center">
        {/* Titre */}
        <h2 className="text-large font-extrabold tracking-wide leading-20 mb-10">
          Inscription
        </h2>

        {/* Container avec CTA connexion et formulaire */}
        <div className="md:grid md:grid-cols-2 bg-[#21223F] rounded-2xl p-15 md:gap-20">
          {/* CTA connexion (visible desktop) */}
          <div className="flex-grow md:flex justify-center items-center hidden">
            <Button to="/login" text="Se connecter" />
          </div>

          {/* Formulaire d'inscription */}
          <div className="md:w-[400px]">
            <SignupForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
