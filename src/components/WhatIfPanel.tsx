"use client";

import { useMemo, useState } from "react";
import { computeAffinity, type CandidateResult } from "@/lib/scoring";
import type { Candidate, Category, Position, Thesis, UserAnswer } from "@/lib/schemas";
import { CATEGORIES } from "@/lib/schemas";

type WhatIfPanelProps = {
  answers: UserAnswer[];
  candidates: Candidate[];
  positions: Position[];
  theses: Thesis[];
  baselineResults: CandidateResult[];
};

const DEFAULT_WEIGHT = 1;

function defaultWeights(): Record<Category, number> {
  return Object.fromEntries(CATEGORIES.map((c) => [c, DEFAULT_WEIGHT])) as Record<
    Category,
    number
  >;
}

export function WhatIfPanel({
  answers,
  candidates,
  positions,
  theses,
  baselineResults,
}: WhatIfPanelProps) {
  const [weights, setWeights] = useState<Record<Category, number>>(defaultWeights);

  const answeredCategories = useMemo(() => {
    const thesisById = new Map(theses.map((t) => [t.id, t]));
    const set = new Set<Category>();
    answers.forEach((a) => {
      const thesis = thesisById.get(a.thesis_id);
      if (thesis) set.add(thesis.category);
    });
    return CATEGORIES.filter((c) => set.has(c));
  }, [answers, theses]);

  const whatIfResults = useMemo(
    () =>
      computeAffinity(answers, candidates, positions, theses, weights).sort(
        (a, b) => b.score - a.score,
      ),
    [answers, candidates, positions, theses, weights],
  );

  const baselineRankById = new Map(
    baselineResults.map((r, i) => [r.candidate_id, i + 1]),
  );

  const isDefault = CATEGORIES.every((c) => weights[c] === DEFAULT_WEIGHT);

  if (answeredCategories.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-foreground">Et si ?</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Ajustez l&apos;importance de chaque thème et observez comment le
        classement change. Votre résultat ne dépend pas d&apos;un algorithme
        boîte noire : il dépend de vos priorités.
      </p>

      <div className="mt-5 flex flex-col gap-4">
        {answeredCategories.map((category) => (
          <div key={category}>
            <div className="flex items-center justify-between text-sm">
              <label htmlFor={`weight-${category}`} className="text-foreground">
                {category}
              </label>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {weights[category].toFixed(2)}×
              </span>
            </div>
            <input
              id={`weight-${category}`}
              type="range"
              min={0}
              max={2}
              step={0.25}
              value={weights[category]}
              onChange={(e) =>
                setWeights((prev) => ({
                  ...prev,
                  [category]: Number(e.target.value),
                }))
              }
              className="mt-1 w-full accent-brand"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setWeights(defaultWeights())}
        disabled={isDefault}
        className="mt-3 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:opacity-40"
      >
        Réinitialiser
      </button>

      <ol className="mt-5 flex flex-col gap-2">
        {whatIfResults.map((result, i) => {
          const candidate = candidates.find((c) => c.id === result.candidate_id);
          if (!candidate) return null;
          const baselineRank = baselineRankById.get(result.candidate_id) ?? i + 1;
          const newRank = i + 1;
          const delta = baselineRank - newRank;

          return (
            <li
              key={candidate.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  #{newRank}
                </span>
                <span className="text-foreground">{candidate.name}</span>
                {delta !== 0 && (
                  <span
                    className={delta > 0 ? "text-emerald-600" : "text-destructive"}
                    aria-label={
                      delta > 0
                        ? `monte de ${delta} place${delta > 1 ? "s" : ""}`
                        : `descend de ${Math.abs(delta)} place${Math.abs(delta) > 1 ? "s" : ""}`
                    }
                  >
                    {delta > 0 ? "↑" : "↓"}
                    {Math.abs(delta)}
                  </span>
                )}
              </div>
              <span className="font-mono tabular-nums text-foreground">
                {Math.round(result.score)}%
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
