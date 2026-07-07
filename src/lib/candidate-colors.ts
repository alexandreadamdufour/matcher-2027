export const CANDIDATE_COLORS: Record<string, string> = {
  alpha: "#2b4c6f", // ink-blue
  beta: "#6b7a3f", // olive
  gamma: "#8c4b3b", // brick
  delta: "#6b5b8c", // plum
};

export const FALLBACK_CANDIDATE_COLOR = "#57534c";

export function candidateColor(candidateId: string): string {
  return CANDIDATE_COLORS[candidateId] ?? FALLBACK_CANDIDATE_COLOR;
}
