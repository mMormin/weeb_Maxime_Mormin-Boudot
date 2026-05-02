import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../ui/Button";
import { getInputClass } from "../../utils/inputClasses";
import { Link } from "react-router";
import { RiErrorWarningFill } from "react-icons/ri";
import { api, API_ENDPOINTS } from "../../config/api";
import { setTokens } from "../../utils/auth";
import { useState } from "react";

// Formulaire de connexion utilisateur
const LoginForm = () => {
  // État pour gérer le retour utilisateur après soumission
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Configuration Formik avec valeurs initiales et validation
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    // Schéma de validation des champs
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Adresse email non valide.")
        .required("Saisissez votre adresse email."),
      password: Yup.string().required("Saisissez votre mot de passe."),
    }),
    // Envoi des identifiants à l'API et stockage des tokens JWT
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitStatus({ type: null, message: "" });

      try {
        const response = await api.post<{ access: string; refresh: string }>(
          API_ENDPOINTS.login,
          values
        );
        setTokens(response.data.access, response.data.refresh);
        setSubmitStatus({
          type: "success",
          message: "Connexion réussie !",
        });
      } catch {
        setSubmitStatus({
          type: "error",
          message: "Une erreur est survenue",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="space-y-9 md:space-y-3 text-white">
        {/* Champ email */}
        <div>
          <label className="sr-only">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={getInputClass(
              !!(formik.touched.email && formik.errors.email)
            )}
          />
          {/* Affichage erreur email */}
          <div className="text-left text-red-400 text-sm h-5 mt-1">
            {formik.touched.email && formik.errors.email && (
              <span className="flex gap-2">
                <RiErrorWarningFill className="mt-[2px]" />
                <p>{formik.errors.email}</p>
              </span>
            )}
          </div>
        </div>

        {/* Champ mot de passe */}
        <div>
          <label className="sr-only">Mot de passe</label>
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={getInputClass(
              !!(formik.touched.password && formik.errors.password)
            )}
          />
          {/* Affichage erreur mot de passe */}
          <div className="text-left text-red-400 text-sm h-5 mt-1">
            {formik.touched.password && formik.errors.password && (
              <span className="flex gap-2">
                <RiErrorWarningFill className="mt-[2px]" />
                <p>{formik.errors.password}</p>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Notification succès/erreur après soumission */}
      {submitStatus.type && (
        <div
          className={`text-center p-4 rounded-lg mb-4 ${
            submitStatus.type === "success"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      {/* Bouton de connexion */}
      <div className="text-center mt-10">
        <Button
          type="submit"
          text={formik.isSubmitting ? "Connexion..." : "Se Connecter"}
          primary
          reverseAnimation
        />
      </div>

      {/* Liens secondaires */}
      <div className="flex flex-col mt-10 md:my-10 tracking-wider space-y-6 justify-center items-center">
        <Link
          to="#"
          className="font-bold hover:underline underline-offset-2 cursor-pointer md:text-sm"
        >
          Mot de passe oublié ?
        </Link>

        <p className="md:text-xs md:w-[50%]">
          Vous n'avez pas de compte ? Vous pouvez en{" "}
          <span className="underline underline-offset-4 cursor-pointer hover:no-underline hover:text-secondary">
            créer un gratuitement
          </span>
          .
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
