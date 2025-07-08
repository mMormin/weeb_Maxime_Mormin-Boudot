import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../ui/Button";
import { RiErrorWarningFill } from "react-icons/ri";
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
      lastName: Yup.string().required("Saisissez votre nom."),
      name: Yup.string().required("Saisissez votre prénom."),
      phone: Yup.string().required("Saisissez votre numéro de téléphone."),
      email: Yup.string()
        .email("Adresse email non valide.")
        .required("Saisissez votre adresse email."),
      message: Yup.string().required("Saisissez votre message."),
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

        <div className="text-left text-red-400 text-sm h-5 mt-1">
          {formik.touched.message && formik.errors.message && (
            <span className="flex gap-2">
              <RiErrorWarningFill className="mt-[2px]" />
              <p>{formik.errors.message}</p>
            </span>
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
