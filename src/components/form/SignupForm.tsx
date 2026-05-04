import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Button from "../ui/Button";
import FieldError from "./FieldError";
import { getInputClass } from "../../utils/inputClasses";
import { Link, useNavigate } from "react-router";
import { api, API_ENDPOINTS } from "../../config/api";
import { setTokens } from "../../utils/auth";
import { useState } from "react";

// Formulaire d'inscription utilisateur
const SignupForm = () => {
  const navigate = useNavigate();

  // Message d'erreur inline (vide = aucune erreur)
  const [errorMessage, setErrorMessage] = useState("");

  // Configuration Formik avec valeurs initiales et validation
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
    // Schéma de validation des champs
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Adresse email non valide.")
        .required("Saisissez votre adresse email."),
      password: Yup.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
        .required("Saisissez un mot de passe."),
      passwordConfirm: Yup.string()
        .oneOf(
          [Yup.ref("password")],
          "Les mots de passe ne correspondent pas."
        )
        .required("Confirmez votre mot de passe."),
    }),
    // Création du compte puis connexion automatique
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setErrorMessage("");

      try {
        await api.post(API_ENDPOINTS.register, {
          email: values.email,
          password: values.password,
        });
      } catch (error) {
        // DRF renvoie { field: ["message", ...] } sur 400 — on remonte l'erreur
        // sur le champ concerné quand c'est possible.
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          const data = error.response.data as Record<string, string[]>;
          const fieldErrors: Record<string, string> = {};
          if (data.email?.[0]) fieldErrors.email = data.email[0];
          if (data.password?.[0]) fieldErrors.password = data.password[0];
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
          } else {
            setErrorMessage("Inscription impossible.");
          }
        } else {
          setErrorMessage("Une erreur est survenue");
        }
        setSubmitting(false);
        return;
      }

      // Connexion automatique : si elle échoue, on bascule vers /login
      // plutôt que de laisser l'utilisateur sur un formulaire déjà soumis.
      try {
        const response = await api.post<{ access: string; refresh: string }>(
          API_ENDPOINTS.login,
          { email: values.email, password: values.password }
        );
        setTokens(response.data.access, response.data.refresh);
        navigate("/articles");
      } catch {
        navigate("/login");
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
          <FieldError
            message={formik.touched.email ? formik.errors.email : undefined}
          />
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
          <FieldError
            message={
              formik.touched.password ? formik.errors.password : undefined
            }
          />
        </div>

        {/* Champ confirmation mot de passe */}
        <div>
          <label className="sr-only">Confirmation du mot de passe</label>
          <input
            type="password"
            name="passwordConfirm"
            placeholder="Confirmer le mot de passe"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.passwordConfirm}
            className={getInputClass(
              !!(
                formik.touched.passwordConfirm && formik.errors.passwordConfirm
              )
            )}
          />
          <FieldError
            message={
              formik.touched.passwordConfirm
                ? formik.errors.passwordConfirm
                : undefined
            }
          />
        </div>
      </div>

      {/* Notification d'erreur après soumission */}
      {errorMessage && (
        <div
          role="alert"
          className="text-center p-4 rounded-lg mb-4 bg-red-500/20 text-red-400"
        >
          {errorMessage}
        </div>
      )}

      {/* Bouton d'inscription */}
      <div className="text-center mt-10">
        <Button
          type="submit"
          text={formik.isSubmitting ? "Création..." : "Créer mon compte"}
          primary
          reverseAnimation
        />
      </div>

      {/* Lien vers la connexion */}
      <div className="flex flex-col mt-10 md:my-10 tracking-wider space-y-6 justify-center items-center">
        <p className="md:text-xs md:w-[60%]">
          Vous avez déjà un compte ?{" "}
          <Link
            to="/login"
            className="underline underline-offset-4 cursor-pointer hover:no-underline hover:text-secondary"
          >
            Connectez-vous
          </Link>
          .
        </p>
      </div>
    </form>
  );
};

export default SignupForm;
