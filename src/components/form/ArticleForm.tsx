import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "../ui/Button";
import FieldError from "./FieldError";
import RichTextEditor from "./RichTextEditor";
import UsernamePromptDialog from "../ui/UsernamePromptDialog";
import { getInputClass } from "../../utils/inputClasses";
import {
  createPost,
  updatePost,
  type Article,
  type ArticleDraft,
} from "../../data/articles";
import { getMe, updateUsername } from "../../data/users";
import { CATEGORY_OPTIONS, CATEGORY_VALUES } from "../../data/categories";

interface ArticleFormProps {
  // Quand fourni, le formulaire passe en mode édition : champs pré-remplis
  // et soumission via PATCH plutôt que POST. Le slug étant read-only côté
  // API, l'URL de détail reste stable après la mise à jour.
  article?: Article;
}

// Formulaire de création / édition d'article (utilisateurs authentifiés)
const ArticleForm = ({ article }: ArticleFormProps) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const isEdit = Boolean(article);

  // Modal "username obligatoire à la 1re publication". Le brouillon validé
  // est mis en attente le temps que l'utilisateur saisisse son nom d'auteur,
  // puis on relance la publication avec ce brouillon. Édition : on ne
  // déclenche jamais la modal — un article ne pouvait pas exister sans
  // username, donc la condition est forcément satisfaite à ce stade.
  const [pendingDraft, setPendingDraft] = useState<ArticleDraft | null>(null);
  const [usernameModalPending, setUsernameModalPending] = useState(false);
  const [usernameModalError, setUsernameModalError] = useState("");

  const publishDraft = async (draft: ArticleDraft) => {
    const created = await createPost(draft);
    navigate(`/articles/${created.slug}`);
  };

  const formik = useFormik({
    initialValues: {
      title: article?.title ?? "",
      excerpt: article?.summary ?? "",
      content: article?.content ?? "",
      category: article?.categoryKey ?? "",
      readTime: (article?.readTimeMinutes ?? "") as string | number,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .trim()
        .required("Saisissez un titre.")
        .max(200, "Le titre ne doit pas dépasser 200 caractères."),
      excerpt: Yup.string()
        .trim()
        .max(300, "Le résumé ne doit pas dépasser 300 caractères."),
      // RichTextEditor publie une chaîne HTML, mais notifie un `""` quand le
      // document est vide (cf. `editor.isEmpty` dans RichTextEditor.tsx) — on
      // peut donc valider via `required` sans inspecter le HTML.
      content: Yup.string().required("Rédigez le contenu de l'article."),
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
      const draft: ArticleDraft = {
        title: values.title.trim(),
        excerpt: values.excerpt.trim(),
        content: values.content,
        category: values.category,
        readTime: Number(values.readTime) || 0,
      };
      try {
        if (article) {
          const saved = await updatePost(article.slug, draft);
          navigate(`/articles/${saved.slug}`);
          return;
        }
        // Création : à la 1re publication, l'utilisateur doit choisir un nom
        // d'auteur. On vérifie via /me ; si vide, on stocke le brouillon et
        // on ouvre la modal bloquante (la publication reprendra ensuite).
        const me = await getMe();
        if (!me.username?.trim()) {
          setPendingDraft(draft);
          return;
        }
        await publishDraft(draft);
      } catch {
        setErrorMessage(
          isEdit
            ? "Une erreur est survenue lors de la mise à jour."
            : "Une erreur est survenue lors de la publication.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleUsernameSubmit = async (username: string) => {
    if (!pendingDraft) return;
    setUsernameModalError("");
    setUsernameModalPending(true);
    try {
      await updateUsername(username);
    } catch {
      setUsernameModalError(
        "Impossible d'enregistrer le nom d'utilisateur. Réessayez.",
      );
      setUsernameModalPending(false);
      return;
    }
    // Username persisté : on ferme la modal et on délègue l'erreur de
    // publication au bandeau du formulaire — l'utilisateur peut relancer la
    // publication via "Publier" sans repasser par la modal (getMe renverra
    // désormais un username non vide).
    try {
      await publishDraft(pendingDraft);
    } catch {
      setErrorMessage("Une erreur est survenue lors de la publication.");
    } finally {
      setPendingDraft(null);
      setUsernameModalPending(false);
    }
  };

  const submitLabel = formik.isSubmitting
    ? isEdit
      ? "Enregistrement..."
      : "Publication..."
    : isEdit
      ? "Enregistrer les modifications"
      : "Publier l'article";

  const titleError = formik.touched.title ? formik.errors.title : undefined;
  const excerptError = formik.touched.excerpt ? formik.errors.excerpt : undefined;
  const categoryError = formik.touched.category
    ? formik.errors.category
    : undefined;
  const readTimeError = formik.touched.readTime
    ? formik.errors.readTime
    : undefined;
  const contentError = formik.touched.content ? formik.errors.content : undefined;

  return (
    <>
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
              className={getInputClass(!!titleError, { large: true })}
            />
            <FieldError message={titleError} />
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
              className={getInputClass(!!excerptError, { large: true })}
            />
            <FieldError message={excerptError} />
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
              className={getInputClass(!!categoryError, { large: true })}
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
            <FieldError message={categoryError} />
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
              className={getInputClass(!!readTimeError, { large: true })}
            />
            <FieldError message={readTimeError} />
          </div>

          <div>
            <RichTextEditor
              ariaLabel="Contenu de l'article"
              placeholder="Contenu de l'article…"
              value={formik.values.content}
              error={!!contentError}
              onChange={(html) => formik.setFieldValue("content", html)}
              onBlur={() => formik.setFieldTouched("content", true)}
            />
            <FieldError message={contentError} />
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="text-center p-4 rounded-lg my-6 bg-red-500/20 text-red-400"
          >
            {errorMessage}
          </div>
        )}

        <div className="text-center mt-10">
          <Button
            type="submit"
            text={submitLabel}
            primary
            reverseAnimation
            disabled={formik.isSubmitting}
          />
        </div>
      </form>

      <UsernamePromptDialog
        open={pendingDraft !== null}
        pending={usernameModalPending}
        errorMessage={usernameModalError}
        onSubmit={handleUsernameSubmit}
      />
    </>
  );
};

export default ArticleForm;
