"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RadarChart } from "@/components/RadarChart";
import { WhatIfPanel } from "@/components/WhatIfPanel";
import { ConvergenceMatrix } from "@/components/ConvergenceMatrix";
import { useAnswers } from "@/lib/answers-store";
import { getCandidates, getPositions, getPosition, getTheses } from "@/lib/content";
import { computeAffinity, type CandidateResult } from "@/lib/scoring";
import { candidateColor } from "@/lib/candidate-colors";
import { CATEGORIES, type Candidate, type Stance } from "@/lib/schemas";
import { useCountUp } from "@/lib/use-count-up";
import { useStaggeredReveal } from "@/lib/use-staggered-reveal";

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
const REVEAL_STEP_MS = 400;

export default function ResultatsPage() {
  return (
    <Suspense fallback={null}>
      <ResultatsContent />
    </Suspense>
  );
}

function ResultatsContent() {
  const { answers } = useAnswers();
  const searchParams = useSearchParams();
  const isExpress = searchParams.get("mode") === "express";
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const results = useMemo(
    () =>
      computeAffinity(answers, CANDIDATES, POSITIONS, THESES).sort(
        (a, b) => b.score - a.score,
      ),
    [answers],
  );

  const revealedCount = useStaggeredReveal(results.length, REVEAL_STEP_MS);

  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    results.slice(0, 3).map((r) => r.candidate_id),
  );

  function toggleCandidate(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  async function shareTop3() {
    const params = new URLSearchParams();
    results.slice(0, 3).forEach((r, i) => {
      params.set(`c${i + 1}`, r.candidate_id);
      params.set(`s${i + 1}`, String(Math.round(r.score)));
    });
    const url = `${window.location.origin}/partage?${params.toString()}`;
    await navigator.clipboard.writeText(url);
    setCopyState("copied");
    setTimeout(() => setCopyState("idle"), 2000);
  }

  if (answers.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-lg text-foreground/80">
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

  const radarSeries = results
    .filter((r) => selectedIds.includes(r.candidate_id))
    .map((r) => ({
      id: r.candidate_id,
      label:
        CANDIDATES.find((c) => c.id === r.candidate_id)?.name ?? r.candidate_id,
      color: candidateColor(r.candidate_id),
      values: CATEGORIES.map(
        (category) =>
          r.categoryScores.find((cs) => cs.category === category)?.score ?? 0,
      ),
    }));

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-serif text-2xl font-medium text-foreground">
            Vos résultats
          </h1>
          {isExpress && (
            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand">
              résultat indicatif · test express
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
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
            const isRevealed = revealedCount > results.length - 1 - i;

            return (
              <CandidateCard
                key={candidate.id}
                rank={i + 1}
                candidate={candidate}
                result={result}
                answers={answers}
                visible={isRevealed}
              />
            );
          })}
        </ol>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">
            Radar comparatif par catégorie
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Choisissez de 1 à 3 candidats à superposer.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {results.map((r) => {
              const candidate = CANDIDATES.find((c) => c.id === r.candidate_id);
              if (!candidate) return null;
              const selected = selectedIds.includes(r.candidate_id);
              const color = candidateColor(r.candidate_id);
              return (
                <button
                  key={r.candidate_id}
                  type="button"
                  onClick={() => toggleCandidate(r.candidate_id)}
                  aria-pressed={selected}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors"
                  style={{
                    borderColor: selected ? color : "var(--border)",
                    color: selected ? color : "var(--muted-foreground)",
                    backgroundColor: selected ? `${color}14` : "transparent",
                  }}
                >
                  <span
                    aria-hidden
                    className="inline-block size-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {candidate.name}
                </button>
              );
            })}
          </div>
          <div className="mt-4">
            <RadarChart axes={[...CATEGORIES]} series={radarSeries} />
          </div>
        </div>

        <WhatIfPanel
          answers={answers}
          candidates={CANDIDATES}
          positions={POSITIONS}
          theses={THESES}
          baselineResults={results}
        />

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">
            Où les candidats sont d&apos;accord
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Les 30 thèses, triées des plus clivantes aux plus consensuelles
            entre les {CANDIDATES.length} candidats.
          </p>
          <div className="mt-4">
            <ConvergenceMatrix theses={THESES} candidates={CANDIDATES} positions={POSITIONS} />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={shareTop3}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {copyState === "copied"
              ? "Lien copié !"
              : "Copier le lien de partage (top 3)"}
          </button>
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

function CandidateCard({
  rank,
  candidate,
  result,
  answers,
  visible,
}: {
  rank: number;
  candidate: Candidate;
  result: CandidateResult;
  answers: { thesis_id: string; stance: Stance }[];
  visible: boolean;
}) {
  const displayScore = useCountUp(result.score, { active: visible });
  const color = candidateColor(candidate.id);

  const matched = answers
    .map((answer) => {
      const thesis = THESES.find((t) => t.id === answer.thesis_id);
      const position = getPosition(candidate.id, answer.thesis_id);
      if (!thesis || !position) return null;
      return {
        answer,
        thesis,
        position,
        affinity: 1 - Math.abs(answer.stance - position.stance) / 4,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const agreements = [...matched].sort((a, b) => b.affinity - a.affinity).slice(0, 3);
  const disagreements = [...matched].sort((a, b) => a.affinity - b.affinity).slice(0, 3);

  if (!visible) {
    return (
      <li
        aria-hidden
        className="h-24 rounded-lg border border-border/40 sm:h-28"
      />
    );
  }

  return (
    <li className="reveal-row rounded-lg border border-border p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-muted-foreground">#{rank}</p>
          <p className="text-base font-medium text-foreground">{candidate.name}</p>
          <p className="text-sm text-muted-foreground">{candidate.party}</p>
        </div>
        <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">
          {Math.round(displayScore)}%
        </p>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{
            width: `${Math.max(0, Math.min(100, displayScore))}%`,
            backgroundColor: color,
          }}
        />
      </div>

      <CategoryMiniBars scores={result.categoryScores} color={color} />

      {(agreements.length > 0 || disagreements.length > 0) && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AgreementList
            title="Vos points d'accord"
            items={agreements}
            candidateName={candidate.name}
          />
          <AgreementList
            title="Vos points de désaccord"
            items={disagreements}
            candidateName={candidate.name}
          />
        </div>
      )}

      <details className="mt-4 group">
        <summary className="cursor-pointer text-sm font-medium text-muted-foreground underline underline-offset-4">
          Voir le détail thèse par thèse
        </summary>
        <ul className="mt-3 flex flex-col gap-4">
          {matched.map(({ answer, thesis, position }) => (
            <li key={thesis.id} className="border-t border-border pt-3 text-sm">
              <p className="font-medium text-foreground">{thesis.statement}</p>
              <p className="mt-1 text-muted-foreground">
                Vous : {STANCE_LABELS[answer.stance]} — {candidate.name} :{" "}
                {STANCE_LABELS[position.stance]}
              </p>
              <p className="mt-1 text-muted-foreground">
                « {position.source_quote} »{" "}
                <a
                  href={position.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  source
                </a>{" "}
                ({position.source_type}, {position.source_date})
              </p>
            </li>
          ))}
        </ul>
      </details>
    </li>
  );
}

function CategoryMiniBars({
  scores,
  color,
}: {
  scores: { category: string; score: number }[];
  color: string;
}) {
  const byCategory = new Map(scores.map((s) => [s.category, s.score]));

  return (
    <div className="mt-4 flex items-end gap-2">
      {CATEGORIES.map((category) => {
        const score = byCategory.get(category);
        return (
          <div key={category} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="h-8 w-full overflow-hidden rounded-sm bg-muted"
              title={`${category} : ${score !== undefined ? Math.round(score) + "%" : "non répondu"}`}
            >
              <div
                className="w-full"
                style={{
                  height: `${score !== undefined ? Math.max(4, Math.min(100, score)) : 0}%`,
                  marginTop: `${100 - (score !== undefined ? Math.max(4, Math.min(100, score)) : 0)}%`,
                  backgroundColor: color,
                  opacity: score !== undefined ? 1 : 0,
                }}
              />
            </div>
            <span className="text-center text-[9px] leading-tight text-muted-foreground">
              {category.slice(0, 4)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AgreementList({
  title,
  items,
  candidateName,
}: {
  title: string;
  items: {
    thesis: { id: string; statement: string };
    position: { source_url: string; source_quote: string };
  }[];
  candidateName: string;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <ul className="mt-2 flex flex-col gap-2">
        {items.map(({ thesis, position }) => (
          <li key={thesis.id} className="text-sm text-foreground/90">
            {thesis.statement}{" "}
            <a
              href={position.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground underline underline-offset-2"
              aria-label={`Source de la position de ${candidateName} sur : ${thesis.statement}`}
            >
              (source)
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
