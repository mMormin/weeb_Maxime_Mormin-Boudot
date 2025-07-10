import { motion } from "motion/react";
import { Link } from "react-router";
import type { ReactNode } from "react";

// Button component props
interface ButtonProps {
  text: string;
  to?: string;
  reverseAnimation?: boolean; // Inverts the hover/tap scale
  primary?: boolean; // Toggles primary style
  compact?: boolean; // Smaller padding & font Button
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children?: ReactNode;
}

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
  // Determines if the link is external (http or anchor)
  const isExternal = to?.startsWith("http") || to?.startsWith("#");

  // Base style depending on primary flag
  const buttonStyles = primary
    ? "bg-purple-600 text-white border-purple-600 border-2 hover:bg-purple-700 hover:border-purple-700"
    : "bg-primary text-white border-white border-2";

  // Shared utility classes
  const commonStyles = [
    compact ? "px-4 py-1 text-base" : "md:px-6 px-3 py-3 md:text-xl",
    "tracking-wider",
    "rounded-lg",
    "transition-colors",
    "cursor-pointer",
  ].join(" ");

  const MotionElem = motion.button;

  // Defines scaling animation direction
  const hoverScale = reverseAnimation ? 0.95 : 1.05;
  const tapScale = reverseAnimation ? 1.05 : 0.95;

  // The animated button content
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

  // If no "to" prop, just return the button
  if (!to) {
    return content;
  }

  // If external link, wrap in <a>
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

  // Otherwise, use <Link> for internal navigation
  return (
    <Link to={to} className="inline-block">
      {content}
    </Link>
  );
};

export default Button;
