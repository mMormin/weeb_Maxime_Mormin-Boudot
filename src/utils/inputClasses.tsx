import clsx from "clsx";

interface InputClassOptions {
  // Active la taille `md:text-lg` utilisée par les formulaires "panneaux"
  // (ContactForm, ArticleForm) — opt-in pour préserver la densité visuelle des
  // formulaires d'auth (LoginForm, SignupForm) qui restent en `text-2xl`.
  large?: boolean;
}

const commonInputClass =
  "w-full p-2 border-2 border-transparent text-white tracking-wider text-2xl text-center transition-all outline-none caret-purple-400";

export function getInputClass(
  hasError: boolean,
  options: InputClassOptions = {},
) {
  return clsx(
    commonInputClass,
    options.large && "md:text-lg",
    hasError
      ? "border-b-red-400 focus:border-b-red-400 placeholder:text-red-400"
      : "border-b-secondary focus:border-secondary placeholder:text-secondary focus:border-2 focus:ring-secondary",
  );
}
