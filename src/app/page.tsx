import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getCandidates, getTheses } from "@/lib/content";

export default function Home() {
  const thesisCount = getTheses().length;
  const candidateCount = getCandidates().length;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">
        <p className="mb-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          MVP — données de test
        </p>
        <h1 className="font-serif text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl">
          matcher-2027
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-foreground/90">
          Comparez vos positions à celles de {candidateCount} candidats
          fictifs sur {thesisCount} thèses de la présidentielle 2027,
          inspiré du Wahl-O-Mat allemand.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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
            className="text-sm font-medium text-foreground/80 underline underline-offset-4 hover:text-foreground"
          >
            Méthodologie
          </Link>
        </div>
      </div>
    </main>
  );
}
