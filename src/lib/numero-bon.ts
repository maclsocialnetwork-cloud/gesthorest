export function generateNumeroBon(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `BC-${y}${m}${d}-${suffix}`;
}
