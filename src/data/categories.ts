// Source unique de vérité pour les catégories d'articles.
//
// Les clés doivent rester synchronisées avec le backend (cf. CATEGORY_CHOICES
// dans blog/models.py). Les labels sont les libellés français affichés dans
// les cards, badges et le select du formulaire. Les colors sont des classes
// Tailwind de fond utilisées par les pastilles des badges.

interface CategoryEntry {
  key: string;
  label: string;
  color: string;
}

const CATEGORIES: ReadonlyArray<CategoryEntry> = [
  { key: "technologie", label: "Technologie", color: "bg-red-500" },
  { key: "developpement", label: "Développement", color: "bg-blue-500" },
  { key: "accessibilite", label: "Accessibilité", color: "bg-green-500" },
  { key: "performance", label: "Performance", color: "bg-yellow-500" },
  { key: "architecture", label: "Architecture", color: "bg-indigo-500" },
  { key: "education", label: "Éducation", color: "bg-teal-500" },
  { key: "securite", label: "Sécurité", color: "bg-orange-500" },
  { key: "alpha_beta", label: "Alpha/Beta", color: "bg-pink-500" },
  { key: "gadget", label: "Gadget", color: "bg-cyan-500" },
  { key: "design", label: "Design", color: "bg-pink-500" },
  { key: "autre", label: "Autre", color: "bg-gray-500" },
];

const BY_KEY = new Map(CATEGORIES.map((c) => [c.key, c]));

export const CATEGORY_OPTIONS: ReadonlyArray<{ value: string; label: string }> =
  CATEGORIES.map(({ key, label }) => ({ value: key, label }));

export const CATEGORY_VALUES: ReadonlyArray<string> = CATEGORIES.map(
  (c) => c.key,
);

export const getCategoryLabel = (key: string): string =>
  BY_KEY.get(key)?.label ?? key;

export const getCategoryColor = (key: string | undefined): string =>
  (key && BY_KEY.get(key)?.color) || "bg-gray-500";
