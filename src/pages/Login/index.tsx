import LoginForm from "../../components/form/LoginForm";
import Button from "../../components/ui/Button";

const Login = () => {
  return (
    <section className="text-white py-40">
      <div className="max-w-8xl mx-auto text-center flex flex-col items-center justify-center">
        <h2 className="text-large font-extrabold tracking-wide leading-20 mb-10">
          Connexion
        </h2>

        <div className="grid grid-cols-2  bg-[#21223F] rounded-2xl p-15 gap-20">
          <div className="w-[400px]">
            <LoginForm />
          </div>

          <div className="flex-grow flex justify-center items-center">
            <Button type="submit" text="Créer un compte" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
