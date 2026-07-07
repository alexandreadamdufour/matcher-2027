"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(
  target: number,
  options?: { active?: boolean; duration?: number },
): number {
  const { active = true, duration = 700 } = options ?? {};
  const [value, setValue] = useState(active ? 0 : target);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setValue(target);
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    }

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, active, duration]);

  return value;
}
