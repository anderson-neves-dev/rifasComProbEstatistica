/** Média aritmética */
export function calculateMean(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

/** Mediana */
export function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/** Moda (pode ter múltiplos valores) */
export function calculateMode(numbers: number[]): number[] {
  if (numbers.length === 0) return [];
  const freq: Record<number, number> = {};
  for (const n of numbers) freq[n] = (freq[n] ?? 0) + 1;
  const max = Math.max(...Object.values(freq));
  return Object.entries(freq)
    .filter(([, count]) => count === max)
    .map(([v]) => Number(v));
}
