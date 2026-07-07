import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getCandidates, getTheses } from "@/lib/content";

export default function Home() {
  const thesisCount = getTheses().length;
  const candidateCount = getCandidates().length;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">
        <p className="mb-6 text-xs font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-500">
          MVP — données de test
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
          matcher-2027
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
          Comparez vos positions à celles de {candidateCount} candidats
          fictifs sur {thesisCount} thèses de la présidentielle 2027,
          inspiré du Wahl-O-Mat allemand.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-500">
          Aucune donnée réelle : les candidats et leurs positions sont
          fictifs à ce stade. La collecte de vrais programmes fera l&apos;objet
          d&apos;une phase éditoriale ultérieure.
        </p>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/test"
            className={buttonVariants({
              size: "lg",
              className: "h-11 px-6 text-base",
            })}
          >
            Commencer le test (5 min)
          </Link>
          <Link
            href="/methodologie"
            className="text-sm font-medium text-neutral-700 underline underline-offset-4 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
          >
            Méthodologie
          </Link>
        </div>
      </div>
    </main>
  );
}
