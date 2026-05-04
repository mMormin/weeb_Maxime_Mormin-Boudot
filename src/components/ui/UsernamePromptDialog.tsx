import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Button from "./Button";
import FieldError from "../form/FieldError";
import { getInputClass } from "../../utils/inputClasses";
import { focusFirstElementOnMount, handleDialogTabKey } from "../../utils/focusTrap";

interface UsernamePromptDialogProps {
  open: boolean;
  pending?: boolean;
  errorMessage?: string;
  onSubmit: (username: string) => void;
}

const MAX_LENGTH = 150;

// Composant interne. En sortant l'état (`value`, `touched`) du composant
// parent — qui reste monté en permanence dans `ArticleForm` — vers ce panel
// monté uniquement quand `open` vaut true, on garantit un reset automatique
// à chaque réouverture, sans useEffect de cleanup.
const DialogPanel = ({
  pending,
  errorMessage,
  onSubmit,
}: Omit<UsernamePromptDialogProps, "open">) => {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const trimmed = value.trim();
  let validationError = "";
  if (!trimmed) {
    validationError = "Saisissez un nom d'utilisateur.";
  } else if (trimmed.length > MAX_LENGTH) {
    validationError = `Le nom d'utilisateur ne doit pas dépasser ${MAX_LENGTH} caractères.`;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (validationError || pending) return;
    onSubmit(trimmed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={handleDialogTabKey}
      role="dialog"
      aria-modal="true"
      aria-labelledby="username-dialog-title"
      aria-describedby="username-dialog-message"
      // Stable callback ref : focus l'input une seule fois au montage. Une
      // identité stable évite que React ne détache/réattache la ref à chaque
      // render (donc à chaque keystroke) et ne réinitialise la sélection.
      ref={focusFirstElementOnMount}
      className="bg-[#21223F] text-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-xl w-full"
    >
      <h2 id="username-dialog-title" className="text-2xl font-extrabold tracking-wide mb-4">
        Choisissez votre nom d'utilisateur
      </h2>
      <p id="username-dialog-message" className="text-gray-300 leading-relaxed mb-6">
        C'est le pseudonyme qui sera affiché sous chacun de vos articles. Il sera associé à votre
        compte et ne peut pas être modifié.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <label className="sr-only" htmlFor="username-dialog-input">
          Nom d'utilisateur
        </label>
        <input
          id="username-dialog-input"
          type="text"
          name="username"
          placeholder="Nom d'utilisateur"
          value={value}
          maxLength={MAX_LENGTH}
          disabled={pending}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          className={`${getInputClass(!!(touched && validationError))} text-left!`}
        />

        <div className="mb-4">
          <FieldError message={touched ? validationError : undefined} />
        </div>

        {errorMessage && (
          <div className="text-center p-3 rounded-lg mb-4 bg-red-500/20 text-red-400 text-sm">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            compact
            primary
            disabled={pending}
            text={pending ? "Enregistrement..." : "Valider"}
          />
        </div>
      </form>
    </motion.div>
  );
};

// Modal bloquante : pas de bouton Annuler, Escape et clic en dehors ne ferment
// pas. C'est le contrat demandé pour la première publication — l'utilisateur
// DOIT renseigner son username avant de pouvoir publier son premier article.
const UsernamePromptDialog = ({
  open,
  pending = false,
  errorMessage,
  onSubmit,
}: UsernamePromptDialogProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          // Clic sur l'arrière-plan : intentionnellement no-op (modal bloquante).
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        >
          <DialogPanel pending={pending} errorMessage={errorMessage} onSubmit={onSubmit} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UsernamePromptDialog;
