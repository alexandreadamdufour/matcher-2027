# matcher-2027

**⚠️ MVP — données fictives.** Aucun candidat réel, aucun parti réel, aucune
position réelle. Ceci est une ossature technique construite pour valider le
produit avant une phase éditoriale de collecte de vrais programmes.
**⚠️ MVP — fictional data.** No real candidates, no real parties, no real
positions. This is a technical scaffold built to validate the product before
a future editorial phase collects real party platforms.

---

## FR — Français

### Concept

matcher-2027 est un comparateur de programmes pour l'élection présidentielle
française 2027 : vous répondez à une série de thèses de politique nationale
et internationale, et l'outil calcule votre affinité avec chaque candidat en
fonction de positions sourcées (programme, vote, interview).

### Inspiration

Le projet s'inspire directement du [Wahl-O-Mat](https://www.bpb.de/themen/wahl-o-mat/),
l'outil d'aide au vote publié par la Bundeszentrale für politische Bildung à
chaque élection allemande : mêmes principes de neutralité de formulation,
même exigence de sourçage systématique des positions, même refus de
recommander un vote.

### Statut MVP — données fictives

Ce dépôt contient un **MVP (Minimum Viable Product)** : l'ossature technique
complète (parcours utilisateur, calcul d'affinité, PWA, pages de
méthodologie/sources) fonctionne de bout en bout, mais **toutes les données
sont fictives** :

- 4 candidats fictifs (Alpha, Beta, Gamma, Delta), aucun parti ni personnalité
  réels.
- 30 thèses réparties en 6 catégories (Économie, International, Écologie,
  Institutions, Société, Éducation), rédigées selon les règles décrites dans
  [`content/thesis-guidelines.md`](./content/thesis-guidelines.md).
- Les positions des candidats et leurs sources (URL, citation, date) sont
  inventées pour les besoins du test technique.

La collecte de vraies thèses et de vraies positions sourcées, avec revue
éditoriale, fait l'objet d'une **phase ultérieure**, non commencée dans ce
dépôt.

### Méthodologie

Le détail du calcul d'affinité, de la grille de positionnement et de la
gouvernance éditoriale prévue est disponible sur la page `/methodologie` de
l'application, et dans [`content/thesis-guidelines.md`](./content/thesis-guidelines.md).
Le calcul se fait entièrement côté client ; aucune réponse n'est transmise à
un serveur.

### Roadmap

- [ ] Phase éditoriale : collecte de vraies thèses et sourcing de vraies
      positions de candidats déclarés
- [ ] Revue éditoriale multi-relecteurs des thèses (neutralité de formulation)
- [ ] Historique de versions des positions (un candidat change de position au
      cours de la campagne)
- [ ] Export / partage enrichi des résultats
- [ ] Traduction complète de l'interface (actuellement FR uniquement, ce
      README est bilingue à titre de documentation)

### Stack technique

Next.js 15 (App Router, TypeScript strict), Tailwind CSS, shadcn/ui, Zod,
Vitest. Aucune base de données : le contenu vit dans `/content` en JSON
versionné. Déploiement Vercel. PWA (manifest + service worker offline).

### Démarrer en local

```bash
pnpm install
pnpm dev       # http://localhost:3000 (ou le premier port disponible)
pnpm test      # tests unitaires (moteur de scoring)
pnpm build     # build de production
```

### RGPD & neutralité

- 100 % du calcul se fait dans votre navigateur, aucune réponse n'est
  collectée.
- Bannière permanente en pied de page rappelant qu'il s'agit d'un outil de
  comparaison, pas d'une recommandation de vote.
- Déclaration d'intérêt de l'auteur disponible sur `/methodologie`.

---

## EN — English

### Concept

matcher-2027 is a party platform comparison tool for the 2027 French
presidential election: you answer a series of national and international
policy statements ("theses"), and the tool computes your affinity with each
candidate based on sourced positions (official platform, parliamentary vote,
interview).

### Inspiration

The project is directly inspired by the German
[Wahl-O-Mat](https://www.bpb.de/themen/wahl-o-mat/), the voting advice
application published before every German election by the Bundeszentrale für
politische Bildung: same neutrality-of-wording principles, same requirement
that every position be sourced, same refusal to recommend a vote.

### MVP status — fictional data

This repository contains an **MVP (Minimum Viable Product)**: the full
technical scaffold (user flow, affinity scoring, PWA, methodology/sources
pages) works end to end, but **all data is fictional**:

- 4 fictional candidates (Alpha, Beta, Gamma, Delta), no real parties or
  public figures.
- 30 theses across 6 categories (Economy, International, Ecology,
  Institutions, Society, Education), written following the rules described in
  [`content/thesis-guidelines.md`](./content/thesis-guidelines.md).
- Candidate positions and their sources (URL, quote, date) are invented for
  the purpose of this technical test.

Collecting real theses and real, sourced candidate positions, with editorial
review, is a **future phase** not started in this repository.

### Methodology

Details on the affinity calculation, the positioning grid, and the planned
editorial governance are available on the app's `/methodologie` page, and in
[`content/thesis-guidelines.md`](./content/thesis-guidelines.md). The
calculation runs entirely client-side; no answer is ever sent to a server.

### Roadmap

- [ ] Editorial phase: collect real theses and source real positions from
      declared candidates
- [ ] Multi-reviewer editorial review of theses (wording neutrality)
- [ ] Version history for positions (a candidate's position can change during
      the campaign)
- [ ] Richer result export / sharing
- [ ] Full interface translation (currently French-only; this README is
      bilingual for documentation purposes)

### Tech stack

Next.js 15 (App Router, strict TypeScript), Tailwind CSS, shadcn/ui, Zod,
Vitest. No database: content lives in `/content` as versioned JSON. Deployed
on Vercel. PWA (manifest + offline service worker).

### Run locally

```bash
pnpm install
pnpm dev       # http://localhost:3000 (or the first available port)
pnpm test      # unit tests (scoring engine)
pnpm build     # production build
```

### GDPR & neutrality

- 100% of the computation runs in your browser; no answer is collected.
- Permanent footer banner reminding users this is a comparison tool, not a
  voting recommendation.
- The author's conflict-of-interest disclosure is available on
  `/methodologie`.
