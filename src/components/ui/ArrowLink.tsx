import { Link } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

// Create a motion-enabled version of the ArrowRight icon
const MotionArrow = motion.create(ArrowRight);

// ArrowLink component props
interface ArrowLinkProps {
  to: string;
  text: string;
}

const ArrowLink = ({ to, text }: ArrowLinkProps) => {
  // Track whether the user is hovering over the link
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="inline-block"
    >
      <Link
        to={to}
        className="group inline-flex items-center gap-4 tracking-[0.5px] font-medium text-xl mt-5 transition-ml duration-200 hover:ml-2"
      >
        <span className="group-hover:underline underline-offset-4 group-hover:text-secondary group-hover:decoration-white transition-all duration-500">
          {text}
        </span>

        <MotionArrow
          className="size-4 mt-0.5"
          animate={
            hovered
              ? {
                  scale: [1, 1.5, 1.5],
                  x: [0, 0, 8, 0, 8, 0],
                }
              : { scale: 1, x: 0 }
          }
          transition={
            hovered
              ? {
                  scale: { duration: 1 },
                  x: {
                    repeat: Infinity,
                    repeatDelay: 1,
                    duration: 1,
                    ease: "easeInOut",
                  },
                }
              : { duration: 0.3 }
          }
        />
      </Link>
    </motion.div>
  );
};

export default ArrowLink;
