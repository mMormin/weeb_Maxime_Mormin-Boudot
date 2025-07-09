import LoginForm from "../../components/form/LoginForm";
import Button from "../../components/ui/Button";

const Login = () => {
  return (
    <section className="text-white py-40 px-10 xl:px-0">
      <div className="max-w-8xl mx-auto text-center flex flex-col items-center justify-center">
        <h2 className="text-large font-extrabold tracking-wide leading-20 mb-10">
          Connexion
        </h2>

        <div className="md:grid md:grid-cols-2 bg-[#21223F] rounded-2xl p-15 md:gap-20">
          <div className="md:w-[400px]">
            <LoginForm />
          </div>

          <div className="flex-grow md:flex justify-center items-center hidden">
            <Button type="submit" text="Créer un compte" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
