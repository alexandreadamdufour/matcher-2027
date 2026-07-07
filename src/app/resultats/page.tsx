"use client";

import Link from "next/link";
import { useMemo } from "react";
import { RadarChart } from "@/components/RadarChart";
import { useAnswers } from "@/lib/answers-store";
import { getCandidates, getPositions, getPosition, getTheses } from "@/lib/content";
import { computeAffinity } from "@/lib/scoring";
import { CATEGORIES, type Stance } from "@/lib/schemas";

const CANDIDATE_COLORS: Record<string, string> = {
  alpha: "#2563eb",
  beta: "#16a34a",
  gamma: "#dc2626",
  delta: "#9333ea",
};

const STANCE_LABELS: Record<Stance, string> = {
  [-2]: "Pas d'accord",
  [-1]: "Plutôt pas d'accord",
  [0]: "Neutre",
  [1]: "Plutôt d'accord",
  [2]: "D'accord",
};

const THESES = getTheses();
const CANDIDATES = getCandidates();
const POSITIONS = getPositions();

export default function ResultatsPage() {
  const { answers } = useAnswers();

  const results = useMemo(
    () =>
      computeAffinity(answers, CANDIDATES, POSITIONS, THESES).sort(
        (a, b) => b.score - a.score,
      ),
    [answers],
  );

  if (answers.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-lg text-neutral-700 dark:text-neutral-300">
          Vous n&apos;avez répondu à aucune thèse pour l&apos;instant.
        </p>
        <Link
          href="/test"
          className="mt-6 text-sm font-medium underline underline-offset-4"
        >
          Commencer le test
        </Link>
      </main>
    );
  }

  const confidence = results[0]?.confidence ?? 0;
  const answeredCount = answers.length;

  const radarSeries = results.map((r) => ({
    id: r.candidate_id,
    label:
      CANDIDATES.find((c) => c.id === r.candidate_id)?.name ?? r.candidate_id,
    color: CANDIDATE_COLORS[r.candidate_id] ?? "#525252",
    values: CATEGORIES.map(
      (category) =>
        r.categoryScores.find((cs) => cs.category === category)?.score ?? 0,
    ),
  }));

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Vos résultats
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Basé sur {answeredCount} thèse{answeredCount > 1 ? "s" : ""} sur{" "}
          {THESES.length} répondue{answeredCount > 1 ? "s" : ""} (
          {Math.round(confidence * 100)}% de couverture).
        </p>

        <ol className="mt-8 flex flex-col gap-3">
          {results.map((result, i) => {
            const candidate = CANDIDATES.find(
              (c) => c.id === result.candidate_id,
            );
            if (!candidate) return null;
            const positions = answers
              .map((a) => ({
                answer: a,
                thesis: THESES.find((t) => t.id === a.thesis_id),
                position: getPosition(candidate.id, a.thesis_id),
              }))
              .filter((x) => x.thesis && x.position);

            return (
              <li
                key={candidate.id}
                className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500">
                      #{i + 1}
                    </p>
                    <p className="text-base font-medium text-neutral-900 dark:text-neutral-50">
                      {candidate.name}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500">
                      {candidate.party}
                    </p>
                  </div>
                  <p className="text-2xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-50">
                    {Math.round(result.score)}%
                  </p>
                </div>

                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-900">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(0, Math.min(100, result.score))}%`,
                      backgroundColor:
                        CANDIDATE_COLORS[candidate.id] ?? "#525252",
                    }}
                  />
                </div>

                <details className="mt-4 group">
                  <summary className="cursor-pointer text-sm font-medium text-neutral-700 underline underline-offset-4 dark:text-neutral-300">
                    Voir le détail thèse par thèse
                  </summary>
                  <ul className="mt-3 flex flex-col gap-4">
                    {positions.map(({ answer, thesis, position }) => (
                      <li
                        key={thesis!.id}
                        className="border-t border-neutral-100 pt-3 text-sm dark:border-neutral-900"
                      >
                        <p className="font-medium text-neutral-900 dark:text-neutral-50">
                          {thesis!.statement}
                        </p>
                        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                          Vous : {STANCE_LABELS[answer.stance]} — {candidate.name}{" "}
                          : {STANCE_LABELS[position!.stance]}
                        </p>
                        <p className="mt-1 text-neutral-500 dark:text-neutral-500">
                          « {position!.source_quote} »{" "}
                          <a
                            href={position!.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                          >
                            source
                          </a>{" "}
                          ({position!.source_type}, {position!.source_date})
                        </p>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            );
          })}
        </ol>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            Radar par catégorie
          </h2>
          <div className="mt-4">
            <RadarChart axes={[...CATEGORIES]} series={radarSeries} />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/test"
            className="text-sm font-medium underline underline-offset-4"
          >
            Reprendre le test
          </Link>
          <Link
            href="/sources"
            className="text-sm font-medium underline underline-offset-4"
          >
            Voir toutes les sources
          </Link>
        </div>
      </div>
    </main>
  );
}
