"use client";

import type { CSSProperties } from "react";
import type { Candidate, Position, Thesis } from "@/lib/schemas";

const POSITIVE_RGB = "43,76,111"; // brand ink-blue
const NEGATIVE_RGB = "163,64,43"; // brick

function stanceStyle(stance: number): CSSProperties {
  if (stance === 0) return { backgroundColor: "var(--muted)" };
  const rgb = stance > 0 ? POSITIVE_RGB : NEGATIVE_RGB;
  const alpha = (Math.abs(stance) / 2) * 0.55 + 0.18;
  return { backgroundColor: `rgba(${rgb}, ${alpha})` };
}

const STANCE_SYMBOL: Record<number, string> = {
  [-2]: "−−",
  [-1]: "−",
  [0]: "·",
  [1]: "+",
  [2]: "++",
};

export function ConvergenceMatrix({
  theses,
  candidates,
  positions,
}: {
  theses: Thesis[];
  candidates: Candidate[];
  positions: Position[];
}) {
  const rows = theses
    .map((thesis) => {
      const cells = candidates.map((candidate) => {
        const position = positions.find(
          (p) => p.candidate_id === candidate.id && p.thesis_id === thesis.id,
        );
        return { candidate, stance: position?.stance ?? null };
      });
      const stances: number[] = cells
        .map((c) => c.stance)
        .filter((s) => s !== null);
      const divergence =
        stances.length > 0 ? Math.max(...stances) - Math.min(...stances) : 0;
      return { thesis, cells, divergence };
    })
    .sort((a, b) => b.divergence - a.divergence);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block size-2.5 rounded-sm"
            style={stanceStyle(2)}
          />
          Accord fort
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block size-2.5 rounded-sm"
            style={stanceStyle(0)}
          />
          Neutre
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block size-2.5 rounded-sm"
            style={stanceStyle(-2)}
          />
          Désaccord fort
        </span>
      </div>

      <div className="mt-4 max-h-[480px] overflow-auto rounded-lg border border-border">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-background">
            <tr>
              <th className="w-1/2 border-b border-border px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                Thèse
              </th>
              {candidates.map((c) => (
                <th
                  key={c.id}
                  className="border-b border-border px-2 py-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {c.name.replace("Candidat", "").replace("Candidate", "").trim()}
                </th>
              ))}
              <th className="border-b border-border px-2 py-2 text-center text-xs font-medium text-muted-foreground">
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ thesis, cells, divergence }) => (
              <tr key={thesis.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2 text-foreground/90">{thesis.statement}</td>
                {cells.map(({ candidate, stance }) => (
                  <td key={candidate.id} className="px-2 py-2 text-center">
                    <span
                      className="mx-auto flex size-7 items-center justify-center rounded-sm font-mono text-xs text-foreground/80"
                      style={stance !== null ? stanceStyle(stance) : undefined}
                      title={`${candidate.name} : ${stance ?? "inconnu"}`}
                    >
                      {stance !== null ? STANCE_SYMBOL[stance] : "?"}
                    </span>
                  </td>
                ))}
                <td className="px-2 py-2 text-center text-[10px] text-muted-foreground">
                  {divergence >= 3 ? "clivant" : divergence <= 1 ? "consensus" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
