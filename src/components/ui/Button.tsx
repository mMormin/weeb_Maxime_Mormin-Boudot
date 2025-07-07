import { motion } from "motion/react";
import { Link } from "react-router";

interface MotionButtonProps {
  primary?: boolean;
  text: string;
  to: string;
}

const Button = ({ text, to, primary = false }: MotionButtonProps) => {
  const isExternal = to.startsWith("http") || to.startsWith("#");

  const buttonStyles = primary
    ? "bg-purple-600 text-white border-purple-600 border-2 hover:bg-purple-700 hover:text-white "
    : "bg-primary text-white border-white border-2";

  const commonStyles =
    "text-xl px-6 py-3 tracking-wide rounded-lg transition-colors cursor-pointer";

  const MotionElem = motion.button;

  const content = (
    <MotionElem
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${buttonStyles} ${commonStyles}`}
    >
      {text}
    </MotionElem>
  );

  return isExternal ? (
    <a href={to} className="inline-block">
      {content}
    </a>
  ) : (
    <Link to={to} className="inline-block">
      {content}
    </Link>
  );
};

export default Button;
