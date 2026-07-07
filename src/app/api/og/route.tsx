import { ImageResponse } from "next/og";
import { getCandidates } from "@/lib/content";

export const runtime = "edge";

const PAPER = "#faf8f4";
const INK = "#1c1b19";
const INK_SOFT = "#57534c";
const RULE = "#e4dfd6";
const BRAND = "#2b4c6f";

async function loadSerifFont(): Promise<ArrayBuffer | null> {
  try {
    const cssUrl =
      "https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600";
    const css = await (await fetch(cssUrl)).text();
    const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
    if (!match) return null;
    const res = await fetch(match[1]);
    if (res.status !== 200) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

function parseEntry(
  searchParams: URLSearchParams,
  rank: number,
): { name: string; score: number } | null {
  const candidateId = searchParams.get(`c${rank}`);
  const scoreRaw = searchParams.get(`s${rank}`);
  if (!candidateId || !scoreRaw) return null;

  const candidate = getCandidates().find((c) => c.id === candidateId);
  const score = Math.max(0, Math.min(100, Number(scoreRaw)));
  if (!candidate || Number.isNaN(score)) return null;

  return { name: candidate.name, score };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const top3 = [1, 2, 3]
    .map((rank) => parseEntry(searchParams, rank))
    .filter((entry): entry is { name: string; score: number } => entry !== null);

  const serifData = await loadSerifFont();
  const entries = top3.length > 0 ? top3 : [{ name: "Aucun résultat", score: 0 }];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: PAPER,
          padding: "64px",
          fontFamily: serifData ? "serif" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 18,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: INK_SOFT,
            }}
          >
            matcher-2027 — comparateur indépendant
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontSize: 52,
              fontWeight: 600,
              color: INK,
            }}
          >
            Mon top {entries.length}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {entries.map((entry, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                borderTop: `1px solid ${RULE}`,
                paddingTop: 18,
              }}
            >
              <div style={{ display: "flex", fontSize: 34, color: INK }}>
                {i + 1}. {entry.name}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "sans-serif",
                  fontSize: 34,
                  fontWeight: 600,
                  color: BRAND,
                }}
              >
                {Math.round(entry.score)}%
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "sans-serif",
            fontSize: 18,
            color: INK_SOFT,
          }}
        >
          Outil de comparaison, pas une recommandation de vote. Données de
          test — candidats fictifs.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: serifData
        ? [{ name: "serif", data: serifData, weight: 600, style: "normal" }]
        : undefined,
    },
  );
}
