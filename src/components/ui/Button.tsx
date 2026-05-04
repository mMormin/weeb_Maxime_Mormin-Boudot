import { motion } from "motion/react";
import { Link } from "react-router";
import type { ReactNode } from "react";

// Props du composant Button
interface ButtonProps {
  text: string;
  to?: string;
  reverseAnimation?: boolean; // Inverse l'effet de scale au hover/tap
  primary?: boolean; // Style primaire (violet)
  destructive?: boolean; // Style destructeur (rouge) — actions de suppression
  compact?: boolean; // Version compacte (padding réduit)
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children?: ReactNode;
}

// Bouton animé avec support navigation interne/externe
const Button = ({
  text,
  to,
  primary = false,
  destructive = false,
  compact = false,
  reverseAnimation = false,
  disabled = false,
  children,
  onClick,
  ...props
}: ButtonProps) => {
  // Détecte si le lien est externe (http) ou un placeholder (#)
  const isExternal = to?.startsWith("http");
  const isPlaceholder = to === "#";

  // Style de base selon la variante. `destructive` prime sur `primary`
  // (un bouton rouge "supprimer" reste rouge même s'il est passé en primary).
  let buttonStyles: string;
  if (destructive) {
    buttonStyles =
      "bg-red-600 text-white border-red-600 border-2 hover:bg-red-700 hover:border-red-700";
  } else if (primary) {
    buttonStyles =
      "bg-purple-600 text-white border-purple-600 border-2 hover:bg-purple-700 hover:border-purple-700";
  } else {
    buttonStyles = "bg-primary text-white border-white border-2";
  }

  // Classes utilitaires communes
  const commonStyles = [
    compact ? "px-4 py-1 text-base" : "md:px-6 px-3 py-3 md:text-xl",
    "tracking-wider",
    "rounded-lg",
    "transition-colors",
    "cursor-pointer",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" ");

  const MotionElem = motion.button;

  // Direction de l'animation de scale ; neutralisée quand disabled pour
  // éviter un feedback visuel sur un bouton qui ne déclenche rien.
  const hoverScale = disabled ? 1 : reverseAnimation ? 0.95 : 1.05;
  const tapScale = disabled ? 1 : reverseAnimation ? 1.05 : 0.95;

  // Contenu animé du bouton
  const content = (
    <MotionElem
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      className={`${buttonStyles} ${commonStyles}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {text ?? children}
    </MotionElem>
  );

  // Sans lien — ou bouton désactivé : retourne le bouton seul. Quand `disabled`
  // est vrai on n'enveloppe PAS d'<a>/<Link> : sinon le clic naviguerait quand
  // même malgré l'attribut `disabled` sur le bouton interne (le wrapper reçoit
  // l'événement avant le bouton et déclencherait la navigation).
  // Idem pour les placeholders ("#") : on évite toute navigation/onglet vierge.
  if (!to || disabled || isPlaceholder) {
    return content;
  }

  // Lien externe : wrapper <a> avec target blank
  if (isExternal) {
    return (
      <a
        href={to}
        className="inline-block"
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  // Lien interne : utilise React Router Link
  return (
    <Link to={to} className="inline-block">
      {content}
    </Link>
  );
};

export default Button;
