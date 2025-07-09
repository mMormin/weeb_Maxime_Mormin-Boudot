import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { useState } from "react";
import {
  FaYoutube,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router";

const socialLinks = [
  { label: "YouTube", Icon: FaYoutube, href: "https://youtube.com" },
  { label: "Facebook", Icon: FaFacebookF, href: "https://facebook.com" },
  { label: "X", Icon: FaTwitter, href: "https://twitter.com" },
  { label: "Instagram", Icon: FaInstagram, href: "https://instagram.com" },
  { label: "LinkedIn", Icon: FaLinkedinIn, href: "https://linkedin.com" },
];

const footerLinks = {
  Product: [
    { label: "Pricing", href: "/pricing" },
    { label: "Overview", href: "/overview" },
    { label: "Browse", href: "/browse" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Five", href: "/five" },
  ],
  Solutions: [
    { label: "Brainstorming", href: "/brainstorming" },
    { label: "Ideation", href: "/ideation" },
    { label: "Wireframing", href: "/wireframing" },
    { label: "Research", href: "/research" },
  ],
  Resources: [
    { label: "Help Center", href: "/help-center" },
    { label: "Blog", href: "/blog" },
    { label: "Tutorials", href: "/tutorials" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Press", href: "/press" },
    { label: "Events", href: "/events" },
    { label: "Careers", href: "/careers" },
  ],
};

const VibratingIcon = ({
  Icon,
  label,
  href,
}: {
  Icon: React.ElementType;
  label: string;
  href: string;
}) => {
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useAnimationFrame(() => {
    if (hovered) {
      x.set((Math.random() - 0.5) * 2);
      y.set((Math.random() - 0.5) * 2);
    } else {
      x.set(0);
      y.set(0);
    }
  });

  return (
    <motion.a
      href={href}
      aria-label={label}
      className="hover:text-secondary transition-colors duration-200"
      target="_blank"
      rel="noopener noreferrer"
      style={{ x, y }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon />
    </motion.a>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white mt-12 px-10 md:px-20 py-15">
      <div className="flex flex-col md:flex-row justify-between mb-15 md:gap-40">
        <Link to="/" className="mb-8 md:mb-0 text-center md:text-left">
          <span className="font-bold text-3xl text-black">weeb</span>
        </Link>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-60 md:mr-40 text-center md:text-left">
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-medium text-blue tracking-wide uppercase mb-5">
                {section}
              </h3>

              <ul className="space-y-6 text-black">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="hover:underline hover:underline-offset-2 hover:text-secondary hover:font-extralight transition-all duration-100"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-primary/10" />

      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 pt-10">
        <p className="text-black mb-4 md:mb-0">
          @ 2025 Weeb, Inc. All rights reserved.
        </p>

        <div className="flex space-x-4 text-black text-lg">
          {socialLinks.map(({ label, Icon, href }) => (
            <VibratingIcon key={label} Icon={Icon} href={href} label={label} />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
