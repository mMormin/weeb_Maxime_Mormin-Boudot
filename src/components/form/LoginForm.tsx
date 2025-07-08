import clsx from "clsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../ui/Button";

const ContactForm = () => {
  const formik = useFormik({
    initialValues: {
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      message: "",
    },
    validationSchema: Yup.object({
      nom: Yup.string().required("Votre nom est requis."),
      prenom: Yup.string().required("Votre prénom est requis."),
      telephone: Yup.string().required("Votre numéro de téléphone est requis."),
      email: Yup.string()
        .email("Email invalide.")
        .required("Votre addresse email est requise."),
      message: Yup.string().required("Le contenu de votre message est requis."),
    }),
    onSubmit: (values) => {
      console.log("Form submitted:", values);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-[#21223F] px-12 py-6 rounded-2xl text-white space-y-4 w-full"
    >
      <div className="grid grid-cols-2 gap-10">
        <div>
          <label className="sr-only">Nom</label>
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nom}
            className={clsx(
              "w-full p-2 border-2 border-transparent text-white tracking-wider text-2xl text-center transition-all outline-none",
              formik.touched.nom && formik.errors.nom
                ? "border-b-red-500 focus:border-b-red-500 placeholder:text-red-500"
                : "border-b-secondary focus:border-secondary placeholder:text-secondary focus:border-2 focus:ring-secondary"
            )}
          />

          <div className="text-red-500 text-sm h-5 mt-1">
            {formik.touched.nom && formik.errors.nom && (
              <p>{formik.errors.nom}</p>
            )}
          </div>
        </div>

        <div>
          <label className="sr-only">Prénom</label>
          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.prenom}
            className={clsx(
              "w-full p-2 border-2 border-transparent text-white tracking-wider text-2xl text-center transition-all outline-none",
              formik.touched.prenom && formik.errors.prenom
                ? "border-b-red-500 focus:border-b-red-500 placeholder:text-red-500"
                : "border-b-secondary focus:border-secondary placeholder:text-secondary focus:border-2 focus:ring-secondary"
            )}
          />
          <div className="text-red-500 text-sm h-5 mt-1">
            {formik.touched.prenom && formik.errors.prenom && (
              <p>{formik.errors.prenom}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10">
        <div>
          <label className="sr-only">Téléphone</label>
          <input
            type="text"
            name="telephone"
            placeholder="Téléphone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.telephone}
            className={clsx(
              "w-full p-2 border-2 border-transparent text-white tracking-wider text-2xl text-center transition-all outline-none",
              formik.touched.telephone && formik.errors.telephone
                ? "border-b-red-500 focus:border-b-red-500 placeholder:text-red-500"
                : "border-b-secondary focus:border-secondary placeholder:text-secondary focus:border-2 focus:ring-secondary"
            )}
          />
          <div className="text-red-500 text-sm h-5 mt-1">
            {formik.touched.telephone && formik.errors.telephone && (
              <p>{formik.errors.telephone}</p>
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
            className={clsx(
              "w-full p-2 border-2 border-transparent text-white tracking-wider text-2xl text-center transition-all outline-none",
              formik.touched.email && formik.errors.email
                ? "border-b-red-500 focus:border-b-red-500 placeholder:text-red-500"
                : "border-b-secondary focus:border-secondary placeholder:text-secondary focus:border-2 focus:ring-secondary"
            )}
          />
          <div className="text-red-500 text-sm h-5 mt-1">
            {formik.touched.email && formik.errors.email && (
              <p>{formik.errors.email}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="sr-only">Message</label>
        <textarea
          name="message"
          placeholder="Votre message"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.message}
          rows={4}
          className={clsx(
            "w-full p-2 border-2 border-transparent text-white tracking-wider text-2xl text-center transition-all outline-none",
            formik.touched.message && formik.errors.message
              ? "border-b-red-500 focus:border-b-red-500 placeholder:text-red-500"
              : "border-b-secondary focus:border-secondary placeholder:text-secondary focus:border-2 focus:ring-secondary"
          )}
        />

        <div className="text-red-500 text-sm h-5 mt-1">
          {formik.touched.message && formik.errors.message && (
            <p>{formik.errors.message}</p>
          )}
        </div>
      </div>

      <div className="text-center">
        <Button type="submit" text="Envoyer" primary />
      </div>
    </form>
  );
};

export default ContactForm;
