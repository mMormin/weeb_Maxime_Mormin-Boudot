import { AnimatePresence, motion } from "motion/react";
import Button from "./Button";
import {
  focusFirstElementOnMount,
  handleDialogTabKey,
} from "../../utils/focusTrap";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  pending?: boolean;
  errorMessage?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Modal de confirmation accessible (role=dialog + aria-modal). On rend le
// markup uniquement quand `open` est true pour éviter d'avoir à synchroniser
// l'état d'ouverture via useEffect — l'animation d'entrée/sortie passe par
// AnimatePresence.
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "Annuler",
  destructive = false,
  pending = false,
  errorMessage,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  // Escape ferme le dialog ; Tab est piégé à l'intérieur du panneau pour
  // empêcher la perte de focus vers le contenu derrière le backdrop.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && !pending) {
      event.stopPropagation();
      onCancel();
      return;
    }
    handleDialogTabKey(event);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => {
            if (!pending) onCancel();
          }}
          onKeyDown={handleKeyDown}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            // Stop propagation : empêche le clic sur le panneau de fermer le dialog
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
            // Stable callback ref : focus le bouton "Annuler" (premier bouton
            // du DOM) une seule fois au montage. Identité stable pour éviter
            // que React ne détache/réattache la ref à chaque render et ne
            // vole le focus pendant l'utilisation. Default safe : action non
            // destructrice si l'utilisateur valide par Entrée à l'ouverture.
            ref={focusFirstElementOnMount}
            className="bg-[#21223F] text-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full"
          >
            <h2
              id="confirm-dialog-title"
              className="text-2xl font-extrabold tracking-wide mb-4"
            >
              {title}
            </h2>
            <p
              id="confirm-dialog-message"
              className="text-gray-300 leading-relaxed mb-8"
            >
              {message}
            </p>

            {errorMessage && (
              <div
                role="alert"
                className="text-center p-3 rounded-lg mb-6 bg-red-500/20 text-red-400 text-sm"
              >
                {errorMessage}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                compact
                disabled={pending}
                onClick={onCancel}
                text={cancelLabel}
              />
              <Button
                type="button"
                compact
                primary={!destructive}
                destructive={destructive}
                disabled={pending}
                onClick={onConfirm}
                text={confirmLabel}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
