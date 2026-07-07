import type { Stance } from "./schemas";

export const STANCE_LABELS: Record<Stance, string> = {
  [-2]: "Pas d'accord",
  [-1]: "Plutôt pas d'accord",
  [0]: "Neutre",
  [1]: "Plutôt d'accord",
  [2]: "D'accord",
};
