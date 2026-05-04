import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../ui/Button";
import FieldError from "./FieldError";
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
      className="bg-[#21223F] px-12 pt-10 pb-6 md:px-8 md:py-8 rounded-2xl text-white space-y-8 md:space-y-4 w-full md:max-w-2xl"
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
              !!(formik.touched.lastName && formik.errors.lastName),
              { large: true }
            )}
          />
          <FieldError
            message={
              formik.touched.lastName ? formik.errors.lastName : undefined
            }
          />
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
              !!(formik.touched.name && formik.errors.name),
              { large: true }
            )}
          />
          <FieldError
            message={formik.touched.name ? formik.errors.name : undefined}
          />
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
              !!(formik.touched.phone && formik.errors.phone),
              { large: true }
            )}
          />
          <FieldError
            message={formik.touched.phone ? formik.errors.phone : undefined}
          />
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
              !!(formik.touched.email && formik.errors.email),
              { large: true }
            )}
          />
          <FieldError
            message={formik.touched.email ? formik.errors.email : undefined}
          />
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
            !!(formik.touched.message && formik.errors.message),
            { large: true }
          )}
        />
        <FieldError
          message={formik.touched.message ? formik.errors.message : undefined}
        />
      </div>

      {/* Notification succès/erreur après soumission */}
      {submitStatus.type && (
        <div
          role={submitStatus.type === "error" ? "alert" : "status"}
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
