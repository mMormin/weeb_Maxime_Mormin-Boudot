import LoginForm from "../../components/form/LoginForm";
import Button from "../../components/ui/Button";

// Page de connexion utilisateur
const Login = () => {
  return (
    <section className="text-white py-40 px-10 xl:px-0">
      <div className="max-w-8xl mx-auto text-center flex flex-col items-center justify-center">
        {/* Titre */}
        <h2 className="text-large font-extrabold tracking-wide leading-20 mb-10">
          Connexion
        </h2>

        {/* Container avec formulaire et CTA inscription */}
        <div className="md:grid md:grid-cols-2 bg-[#21223F] rounded-2xl p-15 md:gap-20">
          {/* Formulaire de connexion */}
          <div className="md:w-[400px]">
            <LoginForm />
          </div>

          {/* CTA création de compte (visible desktop) */}
          <div className="flex-grow md:flex justify-center items-center hidden">
            <Button to="/signup" text="Créer un compte" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
