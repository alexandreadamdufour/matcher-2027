import Link from "next/link";

export const metadata = {
  title: "À propos",
};

export default function AProposPage() {
  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">
            À propos
          </h1>
        </div>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Qui je suis</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            Je m&apos;appelle Alexandre Dufour. Je suis engagé au parti
            Horizons — je le dis ici en clair, tout de suite, plutôt que de le
            laisser découvrir. matcher-2027 est un projet personnel, pas une
            production du parti, mais mon engagement fait partie de qui je
            suis et vous devez pouvoir en tenir compte en utilisant cet outil.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Pourquoi cet outil
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            Parce qu&apos;un désaccord informé vaut mieux qu&apos;un vote par
            réflexe, et qu&apos;un outil qui vous confronte à des positions
            sourcées — plutôt qu&apos;à des slogans — sert la décision de
            chacun, quel que soit son bord. Le Wahl-O-Mat allemand fait ça
            depuis plus de vingt ans sans jamais recommander un candidat ;
            c&apos;est le modèle que je cherche à reproduire pour la
            présidentielle française.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Ce qui garde cet outil honnête
          </h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm leading-relaxed text-foreground/90">
            <li>— Chaque position affichée est sourcée : programme officiel, vote, ou interview, avec citation et date.</li>
            <li>— La méthodologie de calcul et la formulation des thèses sont publiques et documentées.</li>
            <li>— Le code source est ouvert : n&apos;importe qui peut vérifier que le calcul se fait comme annoncé.</li>
            <li>— Cet outil ne recommande jamais de vote, quel que soit le résultat affiché.</li>
          </ul>
        </section>

        <section className="rounded-lg border border-border p-4">
          <h2 className="text-base font-semibold text-foreground">
            Gouvernance prévue pour la phase réelle
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            Le passage aux vraies thèses et aux vraies positions de candidats
            déclarés suivra des règles fixées à l&apos;avance :
          </p>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm leading-relaxed text-foreground/90">
            <li>
              — Chaque position sera sourcée exclusivement à partir de
              documents officiels : programme publié, vote enregistré, ou
              déclaration publique vérifiable.
            </li>
            <li>
              — Les équipes de campagne pourront signaler une position
              qu&apos;elles jugent mal caractérisée et obtenir une correction
              ou un droit de réponse public, avec l&apos;historique des
              modifications visible.
            </li>
            <li>
              — Un comité de relecture indépendant, distinct de l&apos;auteur,
              validera la neutralité de la formulation des thèses avant
              publication.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Feuille de route publique
          </h2>
          <ol className="mt-3 flex flex-col gap-4">
            <li className="border-l-2 border-brand pl-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Été 2026 — maintenant
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                Ossature technique du site, validée avec 4 candidats et 30
                thèses entièrement fictifs.
              </p>
            </li>
            <li className="border-l-2 border-border pl-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Automne 2026 — phase éditoriale
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                Rédaction des vraies thèses et sourcing des positions des
                candidats déclarés, exclusivement à partir de documents
                officiels publiés (programmes, votes, déclarations
                vérifiables).
              </p>
            </li>
            <li className="border-l-2 border-border pl-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Avant publication
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                Relecture par un comité indépendant de l&apos;auteur, puis
                fenêtre de droit de réponse ouverte aux équipes de campagne
                avant toute mise en ligne des positions.
              </p>
            </li>
            <li className="border-l-2 border-border pl-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Lancement public
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                Mise en ligne des vraies thèses et positions ; les données
                fictives de cette version sont entièrement retirées, pas
                simplement masquées.
              </p>
            </li>
          </ol>
        </section>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/methodologie"
            className="text-sm font-medium underline underline-offset-4"
          >
            Voir la méthodologie
          </Link>
          <Link
            href="/confidentialite"
            className="text-sm font-medium underline underline-offset-4"
          >
            Voir la politique de confidentialité
          </Link>
        </div>
      </div>
    </main>
  );
}
