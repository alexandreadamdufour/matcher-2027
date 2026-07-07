"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAnswers } from "@/lib/answers-store";
import { getCandidates, getPositions, getTheses } from "@/lib/content";
import { decodeDuoPayload } from "@/lib/duo-encoding";
import { computeAffinity, computeUserAffinity } from "@/lib/scoring";
import { candidateColor } from "@/lib/candidate-colors";
import { STANCE_LABELS } from "@/lib/stance-labels";
import type { UserAnswer } from "@/lib/schemas";

const THESES = getTheses();
const CANDIDATES = getCandidates();
const POSITIONS = getPositions();
const DUO_PENDING_KEY = "matcher-2027:duoPending";
const DUO_NAME_KEY = "matcher-2027:duo:myName";

export default function DuoPage() {
  return (
    <Suspense fallback={null}>
      <DuoContent />
    </Suspense>
  );
}

function DuoContent() {
  const searchParams = useSearchParams();
  const d = searchParams.get("d");
  const { answers } = useAnswers();
  const [myName, setMyName] = useState("");

  const remote = useMemo(() => (d ? decodeDuoPayload(d) : null), [d]);

  useEffect(() => {
    if (!d) return;
    if (answers.length > 0) {
      window.sessionStorage.removeItem(DUO_PENDING_KEY);
    } else {
      window.sessionStorage.setItem(DUO_PENDING_KEY, d);
    }
  }, [d, answers.length]);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(DUO_NAME_KEY);
    if (stored) setMyName(stored);
  }, []);

  function updateMyName(value: string) {
    setMyName(value);
    window.sessionStorage.setItem(DUO_NAME_KEY, value);
  }

  if (!d || !remote) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-lg text-foreground/80">
          Ce lien de comparaison n&apos;est pas valide ou a expiré.
        </p>
        <Link href="/" className="mt-6 text-sm font-medium underline underline-offset-4">
          Retour à l&apos;accueil
        </Link>
      </main>
    );
  }

  if (answers.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Invitation à comparer
        </p>
        <h1 className="mt-2 font-serif text-2xl font-medium text-foreground">
          {remote.name ? `${remote.name} vous invite à comparer vos réponses` : "On vous invite à comparer vos réponses"}
        </h1>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Faites le test à votre tour pour voir votre taux d&apos;affinité,
          vos points de convergence et de divergence, et vos classements
          candidats côte à côte.
        </p>
        <Link
          href="/test"
          className="mt-6 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Faire le test (5 minutes)
        </Link>
      </main>
    );
  }

  return (
    <DuoComparison
      myAnswers={answers}
      myName={myName}
      onMyNameChange={updateMyName}
      remoteAnswers={remote.answers}
      remoteName={remote.name}
    />
  );
}

function DuoComparison({
  myAnswers,
  myName,
  onMyNameChange,
  remoteAnswers,
  remoteName,
}: {
  myAnswers: UserAnswer[];
  myName: string;
  onMyNameChange: (value: string) => void;
  remoteAnswers: UserAnswer[];
  remoteName?: string;
}) {
  const nameA = myName.trim() || "Vous";
  const nameB = remoteName?.trim() || "Cette personne";

  const userAffinity = useMemo(
    () => computeUserAffinity(myAnswers, remoteAnswers),
    [myAnswers, remoteAnswers],
  );

  const sorted = useMemo(
    () => [...userAffinity.comparisons].sort((a, b) => b.affinity - a.affinity),
    [userAffinity],
  );
  const convergences = sorted.slice(0, 5);
  const divergences = sorted
    .slice(-5)
    .reverse()
    .filter((c) => !convergences.includes(c));

  const rankingsA = useMemo(
    () => computeAffinity(myAnswers, CANDIDATES, POSITIONS, THESES).sort((a, b) => b.score - a.score),
    [myAnswers],
  );
  const rankingsB = useMemo(
    () => computeAffinity(remoteAnswers, CANDIDATES, POSITIONS, THESES).sort((a, b) => b.score - a.score),
    [remoteAnswers],
  );

  const thesisById = new Map(THESES.map((t) => [t.id, t]));

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Comparaison à deux
        </p>
        <h1 className="mt-2 font-serif text-2xl font-medium text-foreground">
          Vous et {nameB}
        </h1>

        <div className="mt-2 max-w-xs">
          <label htmlFor="my-name" className="text-xs text-muted-foreground">
            Votre prénom (local, non partagé)
          </label>
          <input
            id="my-name"
            type="text"
            value={myName}
            onChange={(e) => onMyNameChange(e.target.value)}
            maxLength={40}
            placeholder="Vous"
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground"
          />
        </div>

        <div className="mt-6 rounded-lg border border-border p-6 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Affinité mutuelle
          </p>
          <p className="mt-2 font-mono text-5xl font-semibold tabular-nums text-brand">
            {Math.round(userAffinity.score)}%
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {nameA} et {nameB} — basé sur {userAffinity.sharedCount} thèse
            {userAffinity.sharedCount > 1 ? "s" : ""} répondue
            {userAffinity.sharedCount > 1 ? "s" : ""} par les deux.
          </p>
        </div>

        {convergences.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Vos plus grandes convergences
            </h2>
            <ul className="mt-3 flex flex-col gap-3">
              {convergences.map((c) => (
                <ComparisonRow
                  key={c.thesis_id}
                  statement={thesisById.get(c.thesis_id)?.statement ?? c.thesis_id}
                  nameA={nameA}
                  nameB={nameB}
                  stanceA={c.stanceA}
                  stanceB={c.stanceB}
                />
              ))}
            </ul>
          </div>
        )}

        {divergences.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Vos plus grandes divergences
            </h2>
            <ul className="mt-3 flex flex-col gap-3">
              {divergences.map((c) => (
                <ComparisonRow
                  key={c.thesis_id}
                  statement={thesisById.get(c.thesis_id)?.statement ?? c.thesis_id}
                  nameA={nameA}
                  nameB={nameB}
                  stanceA={c.stanceA}
                  stanceB={c.stanceB}
                />
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Classements candidats côte à côte
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RankingColumn label={nameA} results={rankingsA} />
            <RankingColumn label={nameB} results={rankingsB} />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/resultats" className="text-sm font-medium underline underline-offset-4">
            Voir mes résultats complets
          </Link>
          <Link href="/test" className="text-sm font-medium underline underline-offset-4">
            Refaire le test
          </Link>
        </div>
      </div>
    </main>
  );
}

function ComparisonRow({
  statement,
  nameA,
  nameB,
  stanceA,
  stanceB,
}: {
  statement: string;
  nameA: string;
  nameB: string;
  stanceA: number;
  stanceB: number;
}) {
  return (
    <li className="rounded-md border border-border p-3 text-sm">
      <p className="font-medium text-foreground">{statement}</p>
      <p className="mt-1 text-muted-foreground">
        {nameA} : {STANCE_LABELS[stanceA as keyof typeof STANCE_LABELS]} — {nameB} :{" "}
        {STANCE_LABELS[stanceB as keyof typeof STANCE_LABELS]}
      </p>
    </li>
  );
}

function RankingColumn({
  label,
  results,
}: {
  label: string;
  results: ReturnType<typeof computeAffinity>;
}) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <ol className="flex flex-col gap-1.5">
        {results.map((r, i) => {
          const candidate = CANDIDATES.find((c) => c.id === r.candidate_id);
          if (!candidate) return null;
          return (
            <li key={r.candidate_id} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-foreground">
                <span
                  aria-hidden
                  className="inline-block size-2 rounded-full"
                  style={{ backgroundColor: candidateColor(candidate.id) }}
                />
                {i + 1}. {candidate.name}
              </span>
              <span className="font-mono tabular-nums text-muted-foreground">
                {Math.round(r.score)}%
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
