import { motion } from "motion/react";
import { Link } from "react-router";
import type { ReactNode } from "react";

// Props du composant Button
interface ButtonProps {
  text: string;
  to?: string;
  reverseAnimation?: boolean; // Inverse l'effet de scale au hover/tap
  primary?: boolean; // Style primaire (violet)
  compact?: boolean; // Version compacte (padding réduit)
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children?: ReactNode;
}

// Bouton animé avec support navigation interne/externe
const Button = ({
  text,
  to,
  primary = false,
  compact = false,
  reverseAnimation = false,
  children,
  onClick,
  ...props
}: ButtonProps) => {
  // Détecte si le lien est externe (http) ou ancre (#)
  const isExternal = to?.startsWith("http") || to?.startsWith("#");

  // Style de base selon le type (primary ou default)
  const buttonStyles = primary
    ? "bg-purple-600 text-white border-purple-600 border-2 hover:bg-purple-700 hover:border-purple-700"
    : "bg-primary text-white border-white border-2";

  // Classes utilitaires communes
  const commonStyles = [
    compact ? "px-4 py-1 text-base" : "md:px-6 px-3 py-3 md:text-xl",
    "tracking-wider",
    "rounded-lg",
    "transition-colors",
    "cursor-pointer",
  ].join(" ");

  const MotionElem = motion.button;

  // Direction de l'animation de scale
  const hoverScale = reverseAnimation ? 0.95 : 1.05;
  const tapScale = reverseAnimation ? 1.05 : 0.95;

  // Contenu animé du bouton
  const content = (
    <MotionElem
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      className={`${buttonStyles} ${commonStyles}`}
      onClick={onClick}
      {...props}
    >
      {text ?? children}
    </MotionElem>
  );

  // Sans lien, retourne le bouton seul
  if (!to) {
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
