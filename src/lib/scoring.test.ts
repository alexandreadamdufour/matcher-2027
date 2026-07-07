import { describe, expect, it } from "vitest";
import { computeAffinity } from "./scoring";
import type { Candidate, Position, Thesis, UserAnswer } from "./schemas";

const theses: Thesis[] = [
  { id: "t1", category: "Économie", statement: "s1", explanation: "e1" },
  { id: "t2", category: "Écologie", statement: "s2", explanation: "e2" },
];

const candidates: Candidate[] = [
  {
    id: "alpha",
    name: "Candidat Alpha",
    party: "Parti fictif",
    portrait_url: "/a.svg",
    official_program_url: "https://example.fr",
  },
];

const positions: Position[] = [
  {
    candidate_id: "alpha",
    thesis_id: "t1",
    stance: 2,
    source_url: "https://example.fr/t1",
    source_type: "programme",
    source_quote: "q1",
    source_date: "2026-01-01",
  },
  {
    candidate_id: "alpha",
    thesis_id: "t2",
    stance: -2,
    source_url: "https://example.fr/t2",
    source_type: "programme",
    source_quote: "q2",
    source_date: "2026-01-01",
  },
];

describe("computeAffinity", () => {
  it("returns 100% when the user agrees perfectly with the candidate on every answered thesis", () => {
    const answers: UserAnswer[] = [
      { thesis_id: "t1", stance: 2, weight: 1 },
      { thesis_id: "t2", stance: -2, weight: 1 },
    ];

    const [result] = computeAffinity(answers, candidates, positions, theses);

    expect(result.score).toBeCloseTo(100);
    expect(result.confidence).toBeCloseTo(1);
  });

  it("returns a 0 score and 0 confidence when every thesis is skipped", () => {
    const answers: UserAnswer[] = [];

    const [result] = computeAffinity(answers, candidates, positions, theses);

    expect(result.score).toBe(0);
    expect(result.confidence).toBe(0);
  });

  it("weighs a doubled-importance answer twice as much as a normal one", () => {
    // t1: user fully agrees with candidate (affinity 1), weight 1
    // t2: user fully disagrees with candidate (affinity 0), weight 2 (marked important)
    // weighted average = (1*1 + 0*2) / (1+2) = 1/3 -> ~33.3%
    const answers: UserAnswer[] = [
      { thesis_id: "t1", stance: 2, weight: 1 },
      { thesis_id: "t2", stance: 2, weight: 2 },
    ];

    const [result] = computeAffinity(answers, candidates, positions, theses);

    expect(result.score).toBeCloseTo(33.33, 1);
  });

  it("applies a category multiplier to re-weight the score without mutating stored answer weights", () => {
    // t1 (Économie): user fully agrees (affinity 1). t2 (Écologie): user fully
    // disagrees (affinity 0). Both weight 1 -> baseline score is 50%.
    const answers: UserAnswer[] = [
      { thesis_id: "t1", stance: 2, weight: 1 },
      { thesis_id: "t2", stance: 2, weight: 1 },
    ];

    const [baseline] = computeAffinity(answers, candidates, positions, theses);
    expect(baseline.score).toBeCloseTo(50);

    const [ecologyIgnored] = computeAffinity(
      answers,
      candidates,
      positions,
      theses,
      { Écologie: 0 },
    );
    expect(ecologyIgnored.score).toBeCloseTo(100);

    const [ecologyAmplified] = computeAffinity(
      answers,
      candidates,
      positions,
      theses,
      { Écologie: 3 },
    );
    expect(ecologyAmplified.score).toBeCloseTo(25);
  });
});
