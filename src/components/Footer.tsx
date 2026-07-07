import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-4 text-xs leading-relaxed text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Aucune donnée n&apos;est collectée. Ce test est un outil de
          comparaison, pas une recommandation de vote.
        </p>
        <nav className="flex shrink-0 flex-wrap gap-4" aria-label="Informations">
          <Link href="/methodologie" className="underline underline-offset-2 hover:text-foreground">
            Méthodologie
          </Link>
          <Link href="/sources" className="underline underline-offset-2 hover:text-foreground">
            Sources
          </Link>
          <Link href="/confidentialite" className="underline underline-offset-2 hover:text-foreground">
            Confidentialité
          </Link>
          <Link href="/a-propos" className="underline underline-offset-2 hover:text-foreground">
            À propos
          </Link>
        </nav>
      </div>
    </footer>
  );
}
