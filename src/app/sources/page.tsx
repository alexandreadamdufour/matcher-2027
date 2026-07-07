import { getCandidates, getPositionsForCandidate, getTheses } from "@/lib/content";

export const metadata = {
  title: "Sources — matcher-2027",
};

export default function SourcesPage() {
  const candidates = getCandidates();
  const theses = getTheses();
  const thesisById = new Map(theses.map((t) => [t.id, t]));

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-10">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">
            Sources
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Chaque position attribuée à un candidat renvoie à une source
            primaire fictive (programme, vote ou interview), avec une
            citation, une date et une URL. Rappel : ces sources sont des
            données de test, pas des documents réels.
          </p>
        </div>

        {candidates.map((candidate) => {
          const positions = getPositionsForCandidate(candidate.id);
          return (
            <section key={candidate.id}>
              <h2 className="text-lg font-semibold text-foreground">
                {candidate.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {candidate.party}
              </p>
              <ul className="mt-4 flex flex-col gap-4">
                {positions.map((position) => {
                  const thesis = thesisById.get(position.thesis_id);
                  if (!thesis) return null;
                  return (
                    <li
                      key={`${position.candidate_id}-${position.thesis_id}`}
                      className="border-t border-border pt-3 text-sm"
                    >
                      <p className="font-medium text-foreground">
                        {thesis.statement}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        « {position.source_quote} »
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        <a
                          href={position.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2"
                        >
                          {position.source_url}
                        </a>{" "}
                        — {position.source_type}, {position.source_date}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
