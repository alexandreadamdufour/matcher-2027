# ÉTAT — matcher-2027

Dernière mise à jour : 2026-07-07.

- Dépôt : https://github.com/alexandreadamdufour/matcher-2027 (public)
- Déploiement : https://matcher-2027.vercel.app (production, auto-déploiement
  branché sur `main`)

## Fait

- Scaffold Next.js 15 (App Router, TypeScript strict), Tailwind v4, shadcn/ui,
  pnpm, Vitest.
- Schémas Zod (`Thesis`, `Candidate`, `Position`, `UserAnswer`) et loader de
  contenu (`src/lib/content.ts`) validant tout `/content` au chargement.
- Contenu seed fictif complet : 30 thèses / 6 catégories, 4 candidats
  fictifs (Alpha/Beta/Gamma/Delta), 30 positions sourcées par candidat (120
  positions au total), `content/thesis-guidelines.md`.
- Moteur de scoring pur (`src/lib/scoring.ts`) + 3 tests unitaires Vitest
  (accord parfait, tout-skip, pondération doublée).
- Store de réponses utilisateur en `sessionStorage` (`src/lib/answers-store.tsx`),
  aucune donnée envoyée à un serveur.
- Parcours complet : landing (`/`), questionnaire écran-par-écran (`/test`,
  reprise automatique là où l'utilisateur s'est arrêté), résultats
  (`/resultats` : classement, radar SVG par catégorie, drill-down thèse par
  thèse avec sources), méthodologie (`/methodologie`), sources (`/sources`).
- Partage : page `/partage?c1=..&s1=..` + route `/api/og` générant une image
  Open Graph dynamique (edge runtime, `next/og`) à partir du top 3.
- PWA : `public/manifest.webmanifest`, icônes 192/512 générées
  programmatiquement, service worker `public/sw.js` (network-first pour la
  navigation, cache-first avec mise à jour en arrière-plan pour les assets),
  enregistré uniquement en production.
- Bannière RGPD permanente en pied de page + déclaration d'intérêt de
  l'auteur sur `/methodologie`.
- Passe accessibilité : contraste AA revu (textes secondaires en mode sombre
  remontés de `neutral-500` à `neutral-400`), viewport meta explicite
  (`width=device-width, initial-scale=1`), navigation clavier native
  (boutons, checkbox, `<details>`), `aria-live` sur la progression du
  questionnaire, `role="img"` + description sur le radar.
- `pnpm build`, `pnpm lint`, `tsc --noEmit` et `pnpm test` passent tous sans
  erreur.

## À faire

- **Phase éditoriale réelle** (hors scope de ce sprint) : remplacer les 4
  candidats et les 30 thèses fictifs par de vraies thèses et de vraies
  positions sourcées de candidats déclarés, avec revue multi-relecteurs.
- Vérification manuelle de l'UI en conditions réelles (mobile 375px,
  clavier, lecteur d'écran) — non effectuée dans cette session sur demande
  explicite de l'utilisateur (tests limités au build et aux tests
  unitaires du moteur de scoring).
- Portraits des candidats (`portrait_url` dans le schéma `Candidate`) : le
  champ existe mais n'est pas encore affiché dans l'UI ; aucun fichier
  d'image n'a été créé pour ce MVP.

## Décisions prises

- **Next.js 15, pas 16** : `create-next-app@latest` installe Next 16 par
  défaut ; repin explicite sur `next@^15` pour respecter la contrainte du
  brief.
- **Un seul `content/theses.json`** plutôt qu'un fichier par thèse : la règle
  « un fichier JSON par entité » du brief ne visait explicitement que les
  candidats (`content/candidates/*.json`) ; 30 fichiers thèse séparés
  auraient nui à la lisibilité sans bénéfice.
- **UI à 3 choix (D'accord / Neutre / Pas d'accord) mappés sur l'échelle
  Zod à 5 valeurs (-2..2)** : le schéma `Position`/`UserAnswer` supporte
  5 niveaux (utilisé pour les positions sourcées des candidats, plus
  nuancées), mais le parcours utilisateur simplifie volontairement la saisie
  à 3 boutons + « Passer », conformément au flow décrit dans le brief.
- **Poids par défaut 1, coché → 2** : le schéma autorise un poids `0`, non
  utilisé par l'UI actuelle (aucun bouton ne produit une réponse de poids
  nul) ; il reste disponible pour un futur cas d'usage (ex. import de
  réponses externes).
- **`sessionStorage` plutôt que `localStorage`** : les réponses ne doivent
  pas survivre au-delà de la session de navigation, cohérent avec l'exigence
  RGPD « aucune donnée collectée » et évite une trace persistante sur un
  appareil partagé.
- **Service worker fait main plutôt que `next-pwa`** : évite une dépendance
  supplémentaire pour un besoin simple (quelques routes statiques + assets),
  stratégie network-first pour la navigation (contenu à jour quand le réseau
  est disponible) et cache-first avec revalidation pour les assets/chunks
  hashés.
- **Icônes PWA générées par script Node** (`zlib` + encodage PNG manuel)
  plutôt que via un outil externe (aucun outil de rasterisation SVG
  disponible dans l'environnement) : icônes fonctionnelles minimales (fond
  sombre + disque clair), à remplacer par une vraie identité visuelle avant
  un lancement public.
- **Couleurs candidats codées en dur** (`CANDIDATE_COLORS` dans
  `resultats/page.tsx`) plutôt que dans le schéma `Candidate` : ce n'est pas
  une donnée éditoriale, seulement un besoin de rendu du radar/du classement.
