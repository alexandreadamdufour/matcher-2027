"use client";

import { useEffect, useState } from "react";

/**
 * Reveals items one at a time on an interval, for a "results announcement"
 * effect. Returns how many items (from the start of a sequence) are
 * currently revealed. Skips straight to fully revealed when the user prefers
 * reduced motion.
 */
export function useStaggeredReveal(count: number, stepMs = 400): number {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (count <= 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      setRevealed(count);
      return;
    }

    setRevealed(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setRevealed(step);
      if (step >= count) clearInterval(interval);
    }, stepMs);

    return () => clearInterval(interval);
  }, [count, stepMs]);

  return revealed;
}
