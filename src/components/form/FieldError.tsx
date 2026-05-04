import { RiErrorWarningFill } from "react-icons/ri";

interface FieldErrorProps {
  message?: string;
}

// Bloc d'erreur inline placé directement sous un input. La hauteur fixe `h-5`
// réserve l'espace même quand `message` est vide pour éviter un saut de mise
// en page (CLS) quand l'erreur apparaît.
const FieldError = ({ message }: FieldErrorProps) => (
  <div className="text-left text-red-400 text-sm h-5 mt-1">
    {message && (
      <span className="flex gap-2">
        <RiErrorWarningFill className="mt-[2px]" />
        <p>{message}</p>
      </span>
    )}
  </div>
);

export default FieldError;
