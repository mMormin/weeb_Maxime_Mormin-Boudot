import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../ui/Button";
import { getInputClass } from "../../utils/inputClasses";
import { Link } from "react-router";
import { RiErrorWarningFill } from "react-icons/ri";

const ContactForm = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Adresse email non valide.")
        .required("Saisissez votre adresse email."),
      password: Yup.string().required("Saisissez votre mot de passe. "),
    }),
    onSubmit: (values) => {
      console.log("Form submitted:", values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="space-y-9 md:space-y-3 text-white">
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

        <div>
          <label className="sr-only">Prénom</label>
          <input
            type="text"
            name="password"
            placeholder="Mot de passe"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={getInputClass(
              !!(formik.touched.password && formik.errors.password)
            )}
          />
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

      <div className="text-center mt-10">
        <Button type="submit" text="Se Connecter" primary reverseAnimation />
      </div>

      <div className="flex flex-col mt-10 md:my-10 tracking-wider space-y-6 justify-center items-center">
        <Link
          to="#"
          className="font-bold hover:underline underline-offset-2 cursor-pointer md:text-sm"
        >
          Mot de passe oublié ?
        </Link>

        <p className="md:text-xs md:w-[50%]">
          Vous n’avez pas de compte ? Vous pouvez en{" "}
          <span className="underline underline-offset-4 cursor-pointer hover:no-underline hover:text-secondary">
            créer un gratuitement
          </span>
          .
        </p>
      </div>
    </form>
  );
};

export default ContactForm;
