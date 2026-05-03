import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router";
import { RiErrorWarningFill } from "react-icons/ri";
import Button from "../ui/Button";
import { getInputClass } from "../../utils/inputClasses";
import { createPost } from "../../data/articles";

// Catégories acceptées par l'API Django (cf. CATEGORY_CHOICES dans blog/models.py).
// Les clés doivent rester synchronisées avec le backend ; les libellés sont en FR.
const CATEGORY_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "technologie", label: "Technologie" },
  { value: "developpement", label: "Développement" },
  { value: "accessibilite", label: "Accessibilité" },
  { value: "performance", label: "Performance" },
  { value: "architecture", label: "Architecture" },
  { value: "education", label: "Éducation" },
  { value: "securite", label: "Sécurité" },
  { value: "alpha_beta", label: "Alpha/Beta" },
  { value: "gadget", label: "Gadget" },
  { value: "design", label: "Design" },
  { value: "autre", label: "Autre" },
];

const CATEGORY_VALUES = CATEGORY_OPTIONS.map((c) => c.value);

const FieldError = ({ message }: { message: string }) => (
  <div className="text-left text-red-400 text-sm h-5 mt-1">
    <span className="flex gap-2">
      <RiErrorWarningFill className="mt-[2px]" />
      <p>{message}</p>
    </span>
  </div>
);

// Formulaire de création d'article (utilisateurs authentifiés)
const CreateArticleForm = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "",
      readTime: "" as string | number,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .trim()
        .required("Saisissez un titre.")
        .max(200, "Le titre ne doit pas dépasser 200 caractères."),
      excerpt: Yup.string()
        .trim()
        .max(300, "Le résumé ne doit pas dépasser 300 caractères."),
      content: Yup.string()
        .trim()
        .required("Rédigez le contenu de l'article."),
      category: Yup.string()
        .oneOf(CATEGORY_VALUES, "Sélectionnez une catégorie valide.")
        .required("Sélectionnez une catégorie."),
      // Le champ étant optionnel, on transforme la chaîne vide en `undefined`
      // pour éviter un faux `typeError` sur l'input vidé (Yup v1 ne le fait
      // pas systématiquement). 0 = "non précisé" côté API.
      readTime: Yup.number()
        .transform((value, originalValue) =>
          originalValue === "" ? undefined : value
        )
        .typeError("Le temps de lecture doit être un nombre.")
        .integer("Le temps de lecture doit être un nombre entier.")
        .min(0, "Le temps de lecture ne peut pas être négatif.")
        .max(999, "Le temps de lecture est trop élevé."),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setErrorMessage("");
      try {
        const article = await createPost({
          title: values.title.trim(),
          excerpt: values.excerpt.trim(),
          content: values.content.trim(),
          category: values.category,
          readTime: Number(values.readTime) || 0,
        });
        // La redirection vers le détail de l'article est le signal de succès.
        navigate(`/articles/${article.slug}`);
      } catch {
        setErrorMessage("Une erreur est survenue lors de la publication.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="text-white">
      <div className="space-y-6 md:space-y-3">
        <div>
          <label className="sr-only" htmlFor="title">
            Titre
          </label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Titre"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
            className={getInputClass(
              !!(formik.touched.title && formik.errors.title)
            )}
          />
          {formik.touched.title && formik.errors.title && (
            <FieldError message={formik.errors.title} />
          )}
        </div>

        <div>
          <label className="sr-only" htmlFor="excerpt">
            Résumé
          </label>
          <input
            id="excerpt"
            type="text"
            name="excerpt"
            placeholder="Résumé (optionnel)"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.excerpt}
            className={getInputClass(
              !!(formik.touched.excerpt && formik.errors.excerpt)
            )}
          />
          {formik.touched.excerpt && formik.errors.excerpt && (
            <FieldError message={formik.errors.excerpt} />
          )}
        </div>

        <div>
          <label className="sr-only" htmlFor="category">
            Catégorie
          </label>
          <select
            id="category"
            name="category"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.category}
            className={getInputClass(
              !!(formik.touched.category && formik.errors.category)
            )}
          >
            <option value="" disabled className="bg-primary">
              Catégorie
            </option>
            {CATEGORY_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-primary"
              >
                {option.label}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <FieldError message={formik.errors.category} />
          )}
        </div>

        <div>
          <label className="sr-only" htmlFor="readTime">
            Temps de lecture (minutes)
          </label>
          <input
            id="readTime"
            type="number"
            name="readTime"
            min={0}
            placeholder="Temps de lecture (min)"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.readTime}
            className={getInputClass(
              !!(formik.touched.readTime && formik.errors.readTime)
            )}
          />
          {formik.touched.readTime && formik.errors.readTime && (
            <FieldError message={formik.errors.readTime} />
          )}
        </div>

        <div>
          <label className="sr-only" htmlFor="content">
            Contenu
          </label>
          <textarea
            id="content"
            name="content"
            rows={12}
            placeholder="Contenu de l'article (séparez les paragraphes par une ligne vide)"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.content}
            className={`${getInputClass(
              !!(formik.touched.content && formik.errors.content)
            )} text-left text-base resize-y min-h-48`}
          />
          {formik.touched.content && formik.errors.content && (
            <FieldError message={formik.errors.content} />
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="text-center p-4 rounded-lg my-6 bg-red-500/20 text-red-400">
          {errorMessage}
        </div>
      )}

      <div className="text-center mt-10">
        <Button
          type="submit"
          text={formik.isSubmitting ? "Publication..." : "Publier l'article"}
          primary
          reverseAnimation
        />
      </div>
    </form>
  );
};

export default CreateArticleForm;
