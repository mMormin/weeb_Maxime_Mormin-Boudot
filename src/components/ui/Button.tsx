import { motion } from "motion/react";
import { Link } from "react-router";
import type { ReactNode } from "react";

interface ButtonProps {
  text: string;
  to?: string;
  reverseAnimation?: boolean;
  primary?: boolean;
  compact?: boolean;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
}

const Button = ({
  text,
  to,
  primary = false,
  compact = false,
  reverseAnimation = false,
  children,
  ...props
}: ButtonProps) => {
  const isExternal = to?.startsWith("http") || to?.startsWith("#");

  const buttonStyles = primary
    ? "bg-purple-600 text-white border-purple-600 border-2 hover:bg-purple-700 hover:border-purple-700"
    : "bg-primary text-white border-white border-2";

  const commonStyles = [
    compact ? "px-4 py-1 text-base" : "md:px-6 px-3 py-3 md:text-xl",
    "tracking-wider",
    "rounded-lg",
    "transition-colors",
    "cursor-pointer",
  ].join(" ");

  const MotionElem = motion.button;

  const hoverScale = reverseAnimation ? 0.95 : 1.05;
  const tapScale = reverseAnimation ? 1.05 : 0.95;

  const content = (
    <MotionElem
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      className={`${buttonStyles} ${commonStyles}`}
      {...props}
    >
      {text ?? children}
    </MotionElem>
  );

  if (!to) {
    // Aucun lien, donc un vrai bouton (ex: type="submit")
    return content;
  }

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

  // Lien interne
  return (
    <Link to={to} className="inline-block">
      {content}
    </Link>
  );
};

export default Button;
