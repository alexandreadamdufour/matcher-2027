import type { Metadata } from "next";
import Link from "next/link";
import { getCandidates } from "@/lib/content";

type SearchParams = Record<string, string | string[] | undefined>;

function buildOgQuery(searchParams: SearchParams): string {
  const params = new URLSearchParams();
  for (const rank of [1, 2, 3]) {
    const c = searchParams[`c${rank}`];
    const s = searchParams[`s${rank}`];
    if (typeof c === "string" && typeof s === "string") {
      params.set(`c${rank}`, c);
      params.set(`s${rank}`, s);
    }
  }
  return params.toString();
}

function getTop3(searchParams: SearchParams) {
  const candidates = getCandidates();
  return [1, 2, 3]
    .map((rank) => {
      const c = searchParams[`c${rank}`];
      const s = searchParams[`s${rank}`];
      if (typeof c !== "string" || typeof s !== "string") return null;
      const candidate = candidates.find((cand) => cand.id === c);
      const score = Number(s);
      if (!candidate || Number.isNaN(score)) return null;
      return { candidate, score };
    })
    .filter((entry): entry is { candidate: (typeof candidates)[number]; score: number } => entry !== null);
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const resolved = await searchParams;
  const ogQuery = buildOgQuery(resolved);
  const ogUrl = `/api/og${ogQuery ? `?${ogQuery}` : ""}`;

  return {
    title: "Mon résultat matcher-2027",
    openGraph: {
      title: "Mon résultat matcher-2027",
      description:
        "Comparateur de programmes fictifs pour la présidentielle 2027 — MVP, données de test.",
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
  };
}

export default async function PartagePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;
  const top3 = getTop3(resolved);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-full max-w-md">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          MVP — données de test
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Un résultat matcher-2027
        </h1>

        {top3.length > 0 ? (
          <ol className="mt-6 flex flex-col gap-3 text-left">
            {top3.map(({ candidate, score }, i) => (
              <li
                key={candidate.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 dark:border-neutral-800"
              >
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                  {i + 1}. {candidate.name}
                </span>
                <span className="text-sm font-semibold tabular-nums text-neutral-900 dark:text-neutral-50">
                  {Math.round(score)}%
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
            Ce lien de partage ne contient pas de résultat valide.
          </p>
        )}

        <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-400">
          Ce test est un outil de comparaison, pas une recommandation de vote.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/test"
            className="text-sm font-medium underline underline-offset-4"
          >
            Faire le test à mon tour
          </Link>
          <Link
            href="/methodologie"
            className="text-sm text-neutral-600 underline underline-offset-4 dark:text-neutral-400"
          >
            Voir la méthodologie
          </Link>
        </div>
      </div>
    </main>
  );
}
