import type { Position, Thesis } from "./schemas";

function variance(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  return (
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length
  );
}

/**
 * Selects the theses whose candidate stances vary the most — the ones most
 * likely to actually separate candidates from one another — for the express
 * (shortened) version of the questionnaire. Preserves the original thesis
 * order so category grouping still reads naturally.
 */
export function getDiscriminatingTheses(
  theses: Thesis[],
  positions: Position[],
  count: number,
): Thesis[] {
  const scored = theses.map((thesis) => {
    const stances = positions
      .filter((p) => p.thesis_id === thesis.id)
      .map((p) => p.stance);
    return { thesis, variance: variance(stances) };
  });

  const keepIds = new Set(
    [...scored]
      .sort((a, b) => b.variance - a.variance)
      .slice(0, count)
      .map((s) => s.thesis.id),
  );

  return theses.filter((t) => keepIds.has(t.id));
}
