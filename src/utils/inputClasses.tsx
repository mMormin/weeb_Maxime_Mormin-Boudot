import clsx from "clsx";

const commonInputClass =
  "w-full p-2 border-2 border-transparent text-white tracking-wider text-2xl text-center transition-all outline-none caret-purple-400";

export function getInputClass(hasError: boolean) {
  return clsx(
    commonInputClass,
    hasError
      ? "border-b-red-400 focus:border-b-red-400 placeholder:text-red-400"
      : "border-b-secondary focus:border-secondary placeholder:text-secondary focus:border-2 focus:ring-secondary"
  );
}
