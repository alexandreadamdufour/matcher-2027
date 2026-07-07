import type { Candidate, Category, Position, Thesis, UserAnswer } from "./schemas";

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

      const value = affinity(answer.stance, position.stance) * answer.weight;
      weightedSum += value;
      totalWeight += answer.weight;

      categoryWeightedSum.set(
        thesis.category,
        (categoryWeightedSum.get(thesis.category) ?? 0) + value,
      );
      categoryTotalWeight.set(
        thesis.category,
        (categoryTotalWeight.get(thesis.category) ?? 0) + answer.weight,
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
