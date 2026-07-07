"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { SegmentedProgress } from "@/components/SegmentedProgress";
import { getPositions, getTheses } from "@/lib/content";
import { getDiscriminatingTheses } from "@/lib/express-mode";
import { useAnswers } from "@/lib/answers-store";
import { CATEGORIES, type Stance, type Thesis } from "@/lib/schemas";
import { MODE_STORAGE_KEY, START_TIME_KEY, DUO_PENDING_KEY } from "@/lib/storage-keys";

const ALL_THESES = getTheses();
const POSITIONS = getPositions();
const EXPRESS_THESES = getDiscriminatingTheses(ALL_THESES, POSITIONS, 15);
const MIDPOINT_DELAY_MS = 2600;

type Mode = "full" | "express";

export default function TestPage() {
  const router = useRouter();
  const { getAnswer, setAnswer, answers } = useAnswers();
  const [mode, setMode] = useState<Mode | null>(null);
  const [index, setIndex] = useState(0);
  const [important, setImportant] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [midpointShown, setMidpointShown] = useState(false);
  const [showMidpoint, setShowMidpoint] = useState(false);
  const midpointTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeTheses = useMemo(
    () => (mode === "express" ? EXPRESS_THESES : ALL_THESES),
    [mode],
  );

  useEffect(() => {
    const storedMode = window.sessionStorage.getItem(MODE_STORAGE_KEY);
    if (storedMode === "full" || storedMode === "express") {
      setMode(storedMode);
    } else if (answers.length > 0) {
      setMode("full");
    }
    if (!window.sessionStorage.getItem(START_TIME_KEY)) {
      window.sessionStorage.setItem(START_TIME_KEY, String(Date.now()));
    }
    setHasHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mode) return;
    const theses = mode === "express" ? EXPRESS_THESES : ALL_THESES;
    const firstUnanswered = theses.findIndex((t) => !getAnswer(t.id));
    setIndex(firstUnanswered === -1 ? theses.length : firstUnanswered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (!hasHydrated || !mode) return;
    if (index >= activeTheses.length) {
      const duoPending = window.sessionStorage.getItem(DUO_PENDING_KEY);
      if (duoPending) {
        router.push(`/duo?d=${duoPending}`);
        return;
      }
      router.push(mode === "express" ? "/resultats?mode=express" : "/resultats");
    }
  }, [index, hasHydrated, mode, activeTheses.length, router]);

  const thesis: Thesis | undefined = activeTheses[index];

  useEffect(() => {
    setShowWhy(false);
    if (!thesis) return;
    const existing = getAnswer(thesis.id);
    setImportant(existing?.weight === 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thesis?.id]);

  useEffect(() => {
    return () => {
      if (midpointTimeout.current) clearTimeout(midpointTimeout.current);
    };
  }, []);

  function chooseMode(next: Mode) {
    window.sessionStorage.setItem(MODE_STORAGE_KEY, next);
    setMode(next);
  }

  function goNext() {
    setIndex((i) => {
      const nextIndex = i + 1;
      const halfway = Math.floor(activeTheses.length / 2);
      if (
        mode === "full" &&
        activeTheses.length >= 20 &&
        !midpointShown &&
        nextIndex === halfway
      ) {
        setMidpointShown(true);
        setShowMidpoint(true);
        if (midpointTimeout.current) clearTimeout(midpointTimeout.current);
        midpointTimeout.current = setTimeout(
          () => setShowMidpoint(false),
          MIDPOINT_DELAY_MS,
        );
      }
      return nextIndex;
    });
  }

  function answer(stance: Stance) {
    if (!thesis) return;
    setAnswer(thesis.id, stance, important ? 2 : 1);
    goNext();
  }

  function skip() {
    goNext();
  }

  function goBack() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function dismissMidpoint() {
    if (midpointTimeout.current) clearTimeout(midpointTimeout.current);
    setShowMidpoint(false);
  }

  useEffect(() => {
    if (!hasHydrated || !mode || showMidpoint || !thesis) return;

    function handleKeydown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      switch (event.key) {
        case "1":
          answer(2);
          break;
        case "2":
          answer(0);
          break;
        case "3":
          answer(-2);
          break;
        case "ArrowRight":
          skip();
          break;
        case "ArrowLeft":
          goBack();
          break;
        case "i":
        case "I":
          setImportant((v) => !v);
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, mode, showMidpoint, thesis?.id, important]);

  if (!hasHydrated) return null;

  if (!mode) {
    return <StartScreen onChoose={chooseMode} />;
  }

  if (showMidpoint) {
    return (
      <MidpointScreen
        remaining={activeTheses.length - index}
        onContinue={dismissMidpoint}
      />
    );
  }

  if (!thesis) return null;

  const segments = CATEGORIES.map((category) => {
    const thesesInCategory = activeTheses.filter((t) => t.category === category);
    return {
      category,
      total: thesesInCategory.length,
      answered: thesesInCategory.filter((t) => Boolean(getAnswer(t.id))).length,
      active: thesis.category === category,
    };
  }).filter((s) => s.total > 0);

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={index === 0}
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:invisible"
            >
              ← Précédent
            </button>
            <p
              className="font-mono text-xs tabular-nums text-muted-foreground"
              aria-live="polite"
            >
              {index + 1} / {activeTheses.length}
            </p>
          </div>
          <SegmentedProgress segments={segments} />
        </div>

        <p aria-live="polite" className="sr-only">
          Thèse {index + 1} sur {activeTheses.length}, catégorie {thesis.category} :{" "}
          {thesis.statement}
        </p>

        <div key={thesis.id} className="thesis-transition flex flex-1 flex-col text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {thesis.category}
          </p>
          <h1 className="font-serif text-3xl leading-snug font-medium text-foreground sm:text-4xl">
            {thesis.statement}
          </h1>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => setShowWhy((v) => !v)}
              className="text-sm text-brand underline-offset-4 hover:underline"
              aria-expanded={showWhy}
            >
              {showWhy ? "Masquer le contexte" : "Pourquoi cette question ?"}
            </button>
            {showWhy && (
              <p className="mx-auto mt-3 max-w-md border-l-2 border-brand/40 pl-4 text-left text-sm leading-relaxed text-muted-foreground">
                {thesis.explanation}
              </p>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <Checkbox
              id="important"
              checked={important}
              onCheckedChange={(checked) => setImportant(checked === true)}
            />
            <label htmlFor="important" className="text-sm text-foreground/80">
              Sujet important pour moi{" "}
              <kbd className="rounded border border-border px-1 text-[10px] text-muted-foreground">
                i
              </kbd>
            </label>
          </div>

          <div className="mx-auto mt-8 grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-3">
            <AnswerButton shortcut="1" label="D'accord" onClick={() => answer(2)} />
            <AnswerButton shortcut="2" label="Neutre" onClick={() => answer(0)} />
            <AnswerButton
              shortcut="3"
              label="Pas d'accord"
              onClick={() => answer(-2)}
            />
          </div>

          <button
            type="button"
            onClick={skip}
            className="mt-4 self-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Passer cette thèse
          </button>
        </div>

        <p className="mt-10 hidden text-center text-xs text-muted-foreground sm:block">
          1 / 2 / 3 pour répondre · ← → pour naviguer · i pour marquer important
        </p>
      </div>
    </main>
  );
}

function AnswerButton({
  shortcut,
  label,
  onClick,
}: {
  shortcut: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <span className="inline-flex size-4 items-center justify-center rounded border border-border text-[10px] text-muted-foreground">
        {shortcut}
      </span>
      {label}
    </button>
  );
}

function StartScreen({ onChoose }: { onChoose: (mode: Mode) => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Avant de commencer
        </p>
        <h1 className="font-serif text-2xl font-medium text-foreground">
          Choisissez votre format
        </h1>

        <div className="mt-8 flex flex-col gap-3 text-left">
          <button
            type="button"
            onClick={() => onChoose("full")}
            className="rounded-lg border border-border px-5 py-4 transition-colors hover:border-brand"
          >
            <p className="font-medium text-foreground">Test complet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              30 thèses · environ 5 minutes
            </p>
          </button>
          <button
            type="button"
            onClick={() => onChoose("express")}
            className="rounded-lg border border-border px-5 py-4 transition-colors hover:border-brand"
          >
            <p className="flex items-center gap-2 font-medium text-foreground">
              Test express
              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-normal text-brand">
                résultat indicatif
              </span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              15 thèses les plus déterminantes · environ 2 minutes
            </p>
          </button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Vos réponses restent sur cet appareil, à tout moment.
        </p>
      </div>
    </main>
  );
}

function MidpointScreen({
  remaining,
  onContinue,
}: {
  remaining: number;
  onContinue: () => void;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="midpoint-transition w-full max-w-sm text-center">
        <p className="font-serif text-2xl font-medium text-foreground">
          Plus que {remaining} question{remaining > 1 ? "s" : ""}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Vos réponses restent sur cet appareil.
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="mt-6 text-sm font-medium text-brand underline-offset-4 hover:underline"
        >
          Continuer
        </button>
      </div>
    </main>
  );
}
