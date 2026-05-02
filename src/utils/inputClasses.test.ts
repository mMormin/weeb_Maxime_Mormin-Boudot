import { describe, it, expect } from "vitest";
import { getInputClass } from "./inputClasses";

describe("getInputClass", () => {
  it("inclut les classes communes quel que soit l'état", () => {
    const withError = getInputClass(true);
    const withoutError = getInputClass(false);
    expect(withError).toContain("w-full p-2");
    expect(withoutError).toContain("w-full p-2");
  });

  it("applique le style d'erreur quand hasError vaut true", () => {
    const className = getInputClass(true);
    expect(className).toContain("border-b-red-400");
    expect(className).toContain("placeholder:text-red-400");
    expect(className).not.toContain("border-b-secondary");
  });

  it("applique le style par défaut quand hasError vaut false", () => {
    const className = getInputClass(false);
    expect(className).toContain("border-b-secondary");
    expect(className).toContain("placeholder:text-secondary");
    expect(className).not.toContain("border-b-red-400");
  });
});
