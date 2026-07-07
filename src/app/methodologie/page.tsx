import Link from "next/link";
import { getCandidates, getTheses } from "@/lib/content";

export const metadata = {
  title: "Méthodologie — matcher-2027",
};

export default function MethodologiePage() {
  const thesisCount = getTheses().length;
  const candidateCount = getCandidates().length;

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">
            Méthodologie
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Comment sont construites les thèses, les positions et le score
            d&apos;affinité de matcher-2027.
          </p>
        </div>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Statut du projet — MVP, données fictives
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            Ce site est un prototype technique (MVP). Les {candidateCount}{" "}
            candidats et les {thesisCount} thèses actuellement disponibles
            sont des <strong>données fictives</strong>, créées pour valider
            l&apos;ossature du site avant une phase éditoriale ultérieure de
            collecte de vrais programmes, votes et interviews. Aucun candidat
            réel, aucun parti réel et aucune personnalité réelle ne sont
            représentés à ce stade.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Grille de positionnement
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            Chaque thèse est un énoncé neutre et symétrique sur lequel un
            candidat peut se positionner sur une échelle à 5 niveaux, de
            « pas d&apos;accord » (-2) à « d&apos;accord » (+2), en passant par
            « neutre » (0). Vous répondez avec 3 choix simplifiés (d&apos;accord,
            neutre, pas d&apos;accord) ou passez la thèse si vous n&apos;avez pas
            d&apos;avis. Chaque position de candidat est sourcée : programme
            officiel, vote parlementaire ou interview, avec une citation, une
            URL et une date. Les règles de rédaction des thèses sont détaillées
            dans le fichier{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              content/thesis-guidelines.md
            </code>{" "}
            du dépôt, qui s&apos;inspire des lignes éditoriales du Wahl-O-Mat
            allemand.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Calcul du score d&apos;affinité
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            Pour chaque thèse à laquelle vous répondez, on calcule un écart
            normalisé entre votre position et celle du candidat (de 0, écart
            maximal, à 1, accord parfait). Les thèses passées ne comptent pas
            dans le calcul. Si vous cochez « sujet important pour moi », votre
            réponse compte double dans la moyenne. Le score final est la
            moyenne pondérée de ces écarts sur l&apos;ensemble des thèses
            répondues, exprimée en pourcentage. Le taux de couverture affiché
            (part des {thesisCount} thèses effectivement répondues) donne une
            indication de la fiabilité du score : plus vous passez de thèses,
            plus l&apos;intervalle de confiance du résultat est large.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Confidentialité
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            L&apos;intégralité du calcul se fait dans votre navigateur. Vos
            réponses sont conservées uniquement dans la mémoire de session de
            votre navigateur (sessionStorage) le temps de votre visite et ne
            sont jamais transmises à un serveur. Aucune donnée personnelle
            n&apos;est collectée, aucun compte n&apos;est requis, aucun outil
            d&apos;analytics n&apos;est utilisé.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Gouvernance et transparence
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            Le code source, les thèses, les positions et leurs sources sont
            publics et versionnés dans le dépôt du projet. Toute correction ou
            contestation d&apos;une source peut être signalée via une
            contribution publique (issue ou pull request) sur le dépôt
            GitHub.
          </p>
        </section>

        <section className="rounded-lg border border-border p-4 text-sm leading-relaxed text-foreground/90">
          <h2 className="text-base font-semibold text-foreground">
            Déclaration d&apos;intérêt de l&apos;auteur
          </h2>
          <p className="mt-2">
            Auteur : Alexandre Dufour, engagé au parti Horizons — les
            positionnements sont sourcés et vérifiables, la méthodologie est
            publique.
          </p>
        </section>

        <div>
          <Link
            href="/sources"
            className="text-sm font-medium underline underline-offset-4"
          >
            Voir toutes les sources détaillées
          </Link>
        </div>
      </div>
    </main>
  );
}
