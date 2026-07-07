"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { getTheses } from "@/lib/content";
import { useAnswers } from "@/lib/answers-store";
import type { Stance } from "@/lib/schemas";

const THESES = getTheses();

export default function TestPage() {
  const router = useRouter();
  const { getAnswer, setAnswer } = useAnswers();
  const [index, setIndex] = useState(0);
  const [important, setImportant] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const firstUnanswered = THESES.findIndex((t) => !getAnswer(t.id));
    setIndex(firstUnanswered === -1 ? THESES.length : firstUnanswered);
    setHasHydrated(true);
    // Only run once, on mount, to resume where the user left off.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hasHydrated && index >= THESES.length) {
      router.push("/resultats");
    }
  }, [index, hasHydrated, router]);

  const thesis = THESES[index];

  useEffect(() => {
    if (!thesis) return;
    const existing = getAnswer(thesis.id);
    setImportant(existing?.weight === 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thesis?.id]);

  const progressValue = useMemo(
    () => (index / THESES.length) * 100,
    [index],
  );

  if (!hasHydrated || !thesis) {
    return null;
  }

  function answer(stance: Stance) {
    setAnswer(thesis.id, stance, important ? 2 : 1);
    setIndex((i) => i + 1);
  }

  function skip() {
    setIndex((i) => i + 1);
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
        <div className="mb-8">
          <p
            className="mb-2 text-xs text-neutral-500 dark:text-neutral-400"
            aria-live="polite"
          >
            Thèse {index + 1} sur {THESES.length}
          </p>
          <Progress value={progressValue} aria-label="Progression du test">
            <ProgressTrack>
              <ProgressIndicator />
            </ProgressTrack>
          </Progress>
        </div>

        <div key={thesis.id} className="thesis-transition flex flex-1 flex-col">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            {thesis.category}
          </p>
          <h1 className="text-2xl font-semibold leading-snug text-neutral-900 dark:text-neutral-50">
            {thesis.statement}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {thesis.explanation}
          </p>

          <div className="mt-8 flex items-center gap-2">
            <Checkbox
              id="important"
              checked={important}
              onCheckedChange={(checked) => setImportant(checked === true)}
            />
            <label
              htmlFor="important"
              className="text-sm text-neutral-700 dark:text-neutral-300"
            >
              Sujet important pour moi
            </label>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => answer(2)}
              className="rounded-lg border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900"
            >
              D&apos;accord
            </button>
            <button
              type="button"
              onClick={() => answer(0)}
              className="rounded-lg border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900"
            >
              Neutre
            </button>
            <button
              type="button"
              onClick={() => answer(-2)}
              className="rounded-lg border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900"
            >
              Pas d&apos;accord
            </button>
          </div>

          <button
            type="button"
            onClick={skip}
            className="mt-4 self-start text-sm text-neutral-500 underline underline-offset-4 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            Passer cette thèse
          </button>
        </div>
      </div>
    </main>
  );
}
