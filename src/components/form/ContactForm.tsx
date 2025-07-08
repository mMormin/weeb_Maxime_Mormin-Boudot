import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../ui/Button";
import { getInputClass } from "../../utils/inputClasses";

const ContactForm = () => {
  const formik = useFormik({
    initialValues: {
      lastName: "",
      name: "",
      phone: "",
      email: "",
      message: "",
    },
    validationSchema: Yup.object({
      lastName: Yup.string().required("Votre lastName est requis."),
      name: Yup.string().required("Votre prénom est requis."),
      phone: Yup.string().required("Votre numéro de téléphone est requis."),
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
          <label className="sr-only">lastName</label>
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

          <div className="text-red-500 text-sm h-5 mt-1">
            {formik.touched.lastName && formik.errors.lastName && (
              <p>{formik.errors.lastName}</p>
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
          <div className="text-red-500 text-sm h-5 mt-1">
            {formik.touched.name && formik.errors.name && (
              <p>{formik.errors.name}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10">
        <div>
          <label className="sr-only">Téléphone</label>
          <input
            type="text"
            name="phone"
            placeholder="Téléphone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            className={getInputClass(
              !!(formik.touched.phone && formik.errors.phone)
            )}
          />
          <div className="text-red-500 text-sm h-5 mt-1">
            {formik.touched.phone && formik.errors.phone && (
              <p>{formik.errors.phone}</p>
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
          className={getInputClass(
            !!(formik.touched.message && formik.errors.message)
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
