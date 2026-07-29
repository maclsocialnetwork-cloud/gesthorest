export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatPrix(prix: number | null, devise: string): string {
  if (prix === null) return "Nous contacter";
  return `${prix.toLocaleString("fr-FR")} ${devise}`;
}
