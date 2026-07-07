import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-auto">
      <div className="mx-auto max-w-3xl px-4 py-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Aucune donnée n&apos;est collectée. Ce test est un outil de
          comparaison, pas une recommandation de vote.
        </p>
        <nav className="flex gap-4 shrink-0" aria-label="Informations">
          <Link
            href="/methodologie"
            className="underline underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Méthodologie
          </Link>
          <Link
            href="/sources"
            className="underline underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Sources
          </Link>
        </nav>
      </div>
    </footer>
  );
}
