"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Stance, UserAnswer, Weight } from "./schemas";

const STORAGE_KEY = "matcher-2027:answers";

type AnswersMap = Record<string, UserAnswer>;

type AnswersContextValue = {
  answers: UserAnswer[];
  getAnswer: (thesisId: string) => UserAnswer | undefined;
  setAnswer: (thesisId: string, stance: Stance, weight: Weight) => void;
  reset: () => void;
};

const AnswersContext = createContext<AnswersContextValue | null>(null);

function readFromStorage(): AnswersMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnswersMap) : {};
  } catch {
    return {};
  }
}

export function AnswersProvider({ children }: { children: ReactNode }) {
  const [answersMap, setAnswersMap] = useState<AnswersMap>({});

  useEffect(() => {
    setAnswersMap(readFromStorage());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answersMap));
  }, [answersMap]);

  const setAnswer = useCallback(
    (thesisId: string, stance: Stance, weight: Weight) => {
      setAnswersMap((prev) => ({
        ...prev,
        [thesisId]: { thesis_id: thesisId, stance, weight },
      }));
    },
    [],
  );

  const reset = useCallback(() => {
    setAnswersMap({});
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const getAnswer = useCallback(
    (thesisId: string) => answersMap[thesisId],
    [answersMap],
  );

  const value = useMemo(
    () => ({
      answers: Object.values(answersMap),
      getAnswer,
      setAnswer,
      reset,
    }),
    [answersMap, getAnswer, setAnswer, reset],
  );

  return (
    <AnswersContext.Provider value={value}>{children}</AnswersContext.Provider>
  );
}

export function useAnswers(): AnswersContextValue {
  const ctx = useContext(AnswersContext);
  if (!ctx) {
    throw new Error("useAnswers must be used within an AnswersProvider");
  }
  return ctx;
}
