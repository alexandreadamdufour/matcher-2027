import type { Candidate, Category, Position, Stance, Thesis, UserAnswer } from "./schemas";

export type CategoryScore = {
  category: Category;
  score: number;
  answeredCount: number;
};

export type CandidateResult = {
  candidate_id: string;
  score: number;
  confidence: number;
  categoryScores: CategoryScore[];
};

const MAX_STANCE_DISTANCE = 4;

function affinity(userStance: number, candidateStance: number): number {
  return 1 - Math.abs(userStance - candidateStance) / MAX_STANCE_DISTANCE;
}

export function computeAffinity(
  answers: UserAnswer[],
  candidates: Candidate[],
  positions: Position[],
  theses: Thesis[],
  categoryMultipliers?: Partial<Record<Category, number>>,
): CandidateResult[] {
  const thesisById = new Map(theses.map((t) => [t.id, t]));
  const confidence = theses.length > 0 ? answers.length / theses.length : 0;

  return candidates.map((candidate) => {
    const positionByThesis = new Map(
      positions
        .filter((p) => p.candidate_id === candidate.id)
        .map((p) => [p.thesis_id, p]),
    );

    let weightedSum = 0;
    let totalWeight = 0;
    const categoryWeightedSum = new Map<Category, number>();
    const categoryTotalWeight = new Map<Category, number>();
    const categoryAnsweredCount = new Map<Category, number>();

    for (const answer of answers) {
      const position = positionByThesis.get(answer.thesis_id);
      const thesis = thesisById.get(answer.thesis_id);
      if (!position || !thesis || answer.weight === 0) continue;

      const multiplier = categoryMultipliers?.[thesis.category] ?? 1;
      const effectiveWeight = answer.weight * multiplier;
      const value = affinity(answer.stance, position.stance) * effectiveWeight;
      weightedSum += value;
      totalWeight += effectiveWeight;

      categoryWeightedSum.set(
        thesis.category,
        (categoryWeightedSum.get(thesis.category) ?? 0) + value,
      );
      categoryTotalWeight.set(
        thesis.category,
        (categoryTotalWeight.get(thesis.category) ?? 0) + effectiveWeight,
      );
      categoryAnsweredCount.set(
        thesis.category,
        (categoryAnsweredCount.get(thesis.category) ?? 0) + 1,
      );
    }

    const score = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;

    const categoryScores: CategoryScore[] = [...categoryTotalWeight.keys()].map(
      (category) => ({
        category,
        score:
          ((categoryWeightedSum.get(category) ?? 0) /
            (categoryTotalWeight.get(category) ?? 1)) *
          100,
        answeredCount: categoryAnsweredCount.get(category) ?? 0,
      }),
    );

    return {
      candidate_id: candidate.id,
      score,
      confidence,
      categoryScores,
    };
  });
}

export type UserThesisComparison = {
  thesis_id: string;
  stanceA: Stance;
  stanceB: Stance;
  affinity: number;
};

export type UserAffinityResult = {
  score: number;
  sharedCount: number;
  comparisons: UserThesisComparison[];
};

/**
 * Compares two people's answers directly (not against candidates). Only
 * theses both people answered are counted; skipped theses on either side
 * are ignored, same as candidate scoring.
 */
export function computeUserAffinity(
  answersA: UserAnswer[],
  answersB: UserAnswer[],
): UserAffinityResult {
  const byThesisB = new Map(answersB.map((b) => [b.thesis_id, b]));

  let weightedSum = 0;
  let totalWeight = 0;
  const comparisons: UserThesisComparison[] = [];

  for (const a of answersA) {
    const b = byThesisB.get(a.thesis_id);
    if (!b) continue;
    if (a.weight === 0 && b.weight === 0) continue;

    const combinedWeight = (a.weight + b.weight) / 2;
    const thesisAffinity = affinity(a.stance, b.stance);

    weightedSum += thesisAffinity * combinedWeight;
    totalWeight += combinedWeight;

    comparisons.push({
      thesis_id: a.thesis_id,
      stanceA: a.stance,
      stanceB: b.stance,
      affinity: thesisAffinity,
    });
  }

  return {
    score: totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0,
    sharedCount: comparisons.length,
    comparisons,
  };
}
