import { Link } from "react-router";
import image from "../../../assets/image02.png";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
const MotionArrow = motion(ArrowRight);

const Ressources = () => {
  const [hovered, setHovered] = useState(false);
  return (
    <section className="text-white py-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="space-y-6">
          <p className="font-bold uppercase tracking-[3px]">
            Des ressources pour tous les niveaux
          </p>

          <h2 className="text-large font-extrabold tracking-wide leading-20 text-secondary">
            Apprenez <span className="text-white">et</span> <br />
            Progressez
          </h2>

          <p className="text-lg tracking-wide">
            Que vous débutiez en développement web ou que vous soyez un expert
            cherchant à approfondir vos connaissances, nous vous proposons des
            tutoriels, guides et bonnes pratiques pour apprendre efficacement.
          </p>

          <motion.div
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="inline-block"
          >
            <Link
              to="/ressources"
              className="group inline-flex items-center gap-4 tracking-[0.5px] font-medium text-xl mt-5 transition-ml duration-200 hover:ml-2"
            >
              <span className="group-hover:underline underline-offset-4 group-hover:text-secondary group-hover:decoration-white transition-all duration-500">
                Explorer les ressources
              </span>

              <MotionArrow
                className="size-4 mt-0.5"
                animate={
                  hovered
                    ? {
                        scale: [1, 1.5, 1.5], // grossir et garder la taille
                        x: [0, 0, 8, 0, 8, 0], // ping vers la droite 2 fois
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
        </div>

        <img src={image} alt="Illustration" className="" />
      </div>
    </section>
  );
};

export default Ressources;
