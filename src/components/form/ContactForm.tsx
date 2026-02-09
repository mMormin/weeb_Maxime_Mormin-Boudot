import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../ui/Button";
import { RiErrorWarningFill } from "react-icons/ri";
import { getInputClass } from "../../utils/inputClasses";
import { api, API_ENDPOINTS } from "../../config/api";
import { useState } from "react";

// Formulaire de contact avec validation Yup
const ContactForm = () => {
  // État pour gérer le retour utilisateur après soumission
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Configuration Formik avec valeurs initiales et validation
  const formik = useFormik({
    initialValues: {
      lastName: "",
      name: "",
      phone: "",
      email: "",
      message: "",
    },
    // Schéma de validation des champs
    validationSchema: Yup.object({
      lastName: Yup.string().required("Saisissez votre nom."),
      name: Yup.string().required("Saisissez votre prénom."),
      phone: Yup.string()
        .matches(
          /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
          "Numéro de téléphone non valide."
        )
        .required("Saisissez votre numéro de téléphone."),
      email: Yup.string()
        .email("Adresse email non valide.")
        .required("Saisissez votre adresse email."),
      message: Yup.string().required("Saisissez votre message."),
    }),
    // Envoi du formulaire à l'API
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitStatus({ type: null, message: "" });

      try {
        await api.post(API_ENDPOINTS.contact, values);
        setSubmitStatus({
          type: "success",
          message: "Votre message a été envoyé avec succès !",
        });
        resetForm();
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
    <form
      onSubmit={formik.handleSubmit}
      className="bg-[#21223F] px-12 py-6 rounded-2xl text-white space-y-8 md:space-y-4 w-full pt-10 md:pt-0"
    >
      {/* Ligne 1 : Nom et Prénom */}
      <div className="grid grid-cols-2 gap-10">
        <div>
          <label className="sr-only">Nom</label>
          <input
            type="text"
            name="lastName"
            placeholder="Nom"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
            className={getInputClass(
              !!(formik.touched.lastName && formik.errors.lastName)
            )}
          />
          {/* Affichage erreur nom */}
          <div className="text-left text-red-400 text-sm h-5 mt-1">
            {formik.touched.lastName && formik.errors.lastName && (
              <span className="flex gap-2">
                <RiErrorWarningFill className="mt-[2px]" />
                <p>{formik.errors.lastName}</p>
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="sr-only">Prénom</label>
          <input
            type="text"
            name="name"
            placeholder="Prénom"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className={getInputClass(
              !!(formik.touched.name && formik.errors.name)
            )}
          />
          {/* Affichage erreur prénom */}
          <div className="text-left text-red-400 text-sm h-5 mt-1">
            {formik.touched.name && formik.errors.name && (
              <span className="flex gap-2">
                <RiErrorWarningFill className="mt-[2px]" />
                <p>{formik.errors.name}</p>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ligne 2 : Téléphone et Email */}
      <div className="grid grid-cols-2 gap-10">
        <div>
          <label className="sr-only">Téléphone</label>
          <input
            type="tel"
            name="phone"
            placeholder="Téléphone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            className={getInputClass(
              !!(formik.touched.phone && formik.errors.phone)
            )}
          />
          {/* Affichage erreur téléphone */}
          <div className="text-left text-red-400 text-sm h-5 mt-1">
            {formik.touched.phone && formik.errors.phone && (
              <span className="flex gap-2">
                <RiErrorWarningFill className="mt-[2px]" />
                <p>{formik.errors.phone}</p>
              </span>
            )}
          </div>
        </div>

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
      </div>

      {/* Zone de texte message */}
      <div>
        <label className="sr-only">Message</label>
        <textarea
          name="message"
          placeholder="Votre message"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.message}
          rows={4}
          className={getInputClass(
            !!(formik.touched.message && formik.errors.message)
          )}
        />
        {/* Affichage erreur message */}
        <div className="text-left text-red-400 text-sm h-5 mt-1">
          {formik.touched.message && formik.errors.message && (
            <span className="flex gap-2">
              <RiErrorWarningFill className="mt-[2px]" />
              <p>{formik.errors.message}</p>
            </span>
          )}
        </div>
      </div>

      {/* Notification succès/erreur après soumission */}
      {submitStatus.type && (
        <div
          className={`text-center p-4 rounded-lg ${
            submitStatus.type === "success"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      {/* Bouton de soumission */}
      <div className="text-center">
        <Button
          type="submit"
          text={formik.isSubmitting ? "Envoi en cours..." : "Envoyer"}
          primary
        />
      </div>
    </form>
  );
};

export default ContactForm;
