import { ImageResponse } from "next/og";
import { getCandidates } from "@/lib/content";

export const runtime = "edge";

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

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#737373",
            }}
          >
            matcher-2027 — MVP, données de test
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 48,
              fontWeight: 600,
              color: "#171717",
            }}
          >
            Mon top {top3.length || 3}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {(top3.length > 0
            ? top3
            : [{ name: "Aucun résultat", score: 0 }]
          ).map((entry, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid #e5e5e5",
                paddingTop: 16,
              }}
            >
              <div style={{ display: "flex", fontSize: 32, color: "#171717" }}>
                {i + 1}. {entry.name}
              </div>
              <div
                style={{ display: "flex", fontSize: 32, fontWeight: 600, color: "#171717" }}
              >
                {Math.round(entry.score)}%
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", fontSize: 18, color: "#737373" }}>
          Outil de comparaison, pas une recommandation de vote.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
