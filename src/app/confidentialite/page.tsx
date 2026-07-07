import Link from "next/link";

export const metadata = {
  title: "Confidentialité",
};

export default function ConfidentialitePage() {
  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">
            Confidentialité
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ce que devient — et ne devient pas — ce que vous répondez ici.
          </p>
        </div>

        <section aria-label="Schéma du parcours de vos données">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
            <FlowBox title="Vos réponses" detail="d'accord, neutre, pas d'accord…" />
            <Arrow />
            <FlowBox title="Votre navigateur" detail="calcul du score, en mémoire" />
            <Arrow />
            <FlowBox title="Rien d'autre" detail="aucun serveur, aucun tiers" emphasis />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Aucune collecte
          </h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm leading-relaxed text-foreground/90">
            <li>— Aucun cookie de suivi.</li>
            <li>— Aucun outil d&apos;analytics (pas de Google Analytics, Plausible, ou équivalent).</li>
            <li>— Aucun compte, aucune inscription, aucune adresse e-mail demandée.</li>
            <li>
              — Vos réponses vivent dans la mémoire de session de votre
              navigateur (<code className="rounded bg-muted px-1 py-0.5 text-xs">sessionStorage</code>)
              et disparaissent quand vous fermez l&apos;onglet.
            </li>
            <li>
              — Le calcul d&apos;affinité s&apos;exécute entièrement dans votre
              navigateur : à aucun moment vos réponses ne sont envoyées à un
              serveur.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Code source ouvert
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            Vous n&apos;avez pas à nous croire sur parole : l&apos;intégralité du
            code, y compris le moteur de calcul et le stockage des réponses,
            est publique et consultable.
          </p>
          <a
            href="https://github.com/alexandreadamdufour/matcher-2027"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-brand underline underline-offset-4"
          >
            github.com/alexandreadamdufour/matcher-2027
          </a>
        </section>

        <div>
          <Link
            href="/methodologie"
            className="text-sm font-medium underline underline-offset-4"
          >
            Voir la méthodologie complète
          </Link>
        </div>
      </div>
    </main>
  );
}

function FlowBox({
  title,
  detail,
  emphasis,
}: {
  title: string;
  detail: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`w-full rounded-lg border px-4 py-3 text-center sm:w-40 ${
        emphasis ? "border-brand bg-brand-soft" : "border-border"
      }`}
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function Arrow() {
  return (
    <span aria-hidden className="text-muted-foreground">
      <span className="sm:hidden">↓</span>
      <span className="hidden sm:inline">→</span>
    </span>
  );
}
