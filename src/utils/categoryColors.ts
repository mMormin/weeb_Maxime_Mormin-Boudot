// Retourne la classe Tailwind de couleur selon la catégorie d'article
export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "Technologie":
      return "bg-red-500";
    case "Développement":
      return "bg-blue-500";
    case "Accessibilité":
      return "bg-green-500";
    case "Performance":
      return "bg-yellow-500";
    case "CSS":
      return "bg-purple-500";
    case "Sécurité":
      return "bg-orange-500";
    case "Design":
      return "bg-pink-500";
    case "Architecture":
      return "bg-indigo-500";
    case "Testing":
      return "bg-teal-500";
    default:
      return "bg-gray-500";
  }
};
