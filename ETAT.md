# ÉTAT — matcher-2027

Dernière mise à jour : 2026-07-07 (v2 — produit civique de référence).

- Dépôt : https://github.com/alexandreadamdufour/matcher-2027 (public)
- Déploiement : https://matcher-2027.vercel.app (production, auto-déploiement
  branché sur `main`)

## v2 — produit civique de référence (même journée)

Évolution majeure du MVP initial (sections ci-dessous, conservées telles
quelles) vers un produit visuellement et fonctionnellement abouti, tout en
gardant les 4 candidats et 30 thèses strictement fictifs.

**Fait (v2) :**

- Refonte visuelle éditoriale : palette papier/encre/accent bleu-encre
  (`src/app/globals.css`), police serif Source Serif 4 réservée à l'énoncé
  des thèses et aux titres H1 (un seul « moment serif » par écran), couleurs
  candidats désaturées (`src/lib/candidate-colors.ts`).
- Questionnaire repensé (`/test`) : thèse en grande serif centrée, disclosure
  « Pourquoi cette question ? » (réutilise `thesis.explanation`), barre de
  progression segmentée par catégorie (`SegmentedProgress`), retour arrière
  avec conservation des réponses, raccourcis clavier (1/2/3, flèches, i),
  écran de mi-parcours après la thèse 15 (mode complet uniquement), mode
  express (15 thèses les plus discriminantes, calculées par variance des
  positions candidats — `src/lib/express-mode.ts`) avec écran de choix de
  format au démarrage.
- Résultats (`/resultats`) : révélation progressive dernier→premier avec
  count-up des scores (`useStaggeredReveal`, `useCountUp`, respectent
  `prefers-reduced-motion`), carte candidat enrichie (mini-barres par
  catégorie, top 3 accords/désaccords sourcés), radar comparatif avec
  sélection de 1 à 3 candidats et tooltips natifs par point, matrice de
  convergence thèse × candidats triée des plus clivantes aux plus
  consensuelles (`ConvergenceMatrix`), panneau « Et si ? » de repondération
  par catégorie avec reclassement en temps réel (`WhatIfPanel`, nécessite le
  paramètre `categoryMultipliers` ajouté à `computeAffinity`).
- Confiance : bandeau permanent « version de démonstration » en tête de
  page, pages dédiées `/confidentialite` (schéma du parcours des données) et
  `/a-propos` (bio + disclosure Horizons dès la 2e phrase + gouvernance
  prévue), image OG éditoriale régénérée avec police serif chargée à la
  volée, bouton de partage utilisant la Web Share API sur mobile (repli
  clipboard sur desktop), ligne de fin de test (« Ce test vous a pris X
  minutes... ») basée sur un timestamp `sessionStorage`.
- Finitions : `sitemap.ts`/`robots.ts`, métadonnées par route (layouts dédiés
  pour `/test` et `/resultats`, client components), anneau de focus clavier
  cohérent (`*:focus-visible` global), région `aria-live` annonçant le
  changement de thèse, migration des pages restantes (`/`, `/sources`,
  `/methodologie`, `/partage`, `Footer`) vers les tokens de couleur
  sémantiques pour la cohérence visuelle.
- `pnpm build`, `pnpm lint`, `tsc --noEmit` et `pnpm test` (4 tests, dont un
  nouveau sur `categoryMultipliers`) passent tous sans erreur ; vérifié en
  production sur Vercel (toutes les routes + `/api/og` renvoient 200).

**Décisions prises (v2) :**

- **Pas de Recharts, radar/heatmap faits main en SVG/HTML** : le radar
  existant (SVG maison) et une table CSS suffisaient aux besoins (overlay de
  séries, tooltips via `<title>`), évitant une dépendance supplémentaire
  alors que le brief demandait explicitement de ne pas alourdir le stack.
- **OG image : police chargée à la volée depuis Google Fonts dans la route
  edge** plutôt que bundlée, avec repli silencieux sur une police système si
  le fetch échoue — évite d'embarquer un fichier de police dans le dépôt.
  Un bug Satori (« Expected `<div>` to have explicit display: flex ») a été
  détecté et corrigé via un test réel de la route (build de prod +
  `pnpm start` + `curl`, sans navigateur) avant le déploiement.
- **Matrice de convergence triée par divergence décroissante** (thèses les
  plus clivantes d'abord) plutôt que par catégorie ou ordre alphabétique :
  c'est l'angle le plus intéressant éditorialement (« où les candidats
  s'opposent le plus ») et documenté comme tel dans l'UI.
- **`categoryMultipliers` optionnel sur `computeAffinity`** plutôt qu'une
  fonction de scoring séparée pour le panneau « Et si ? » : garde un seul
  moteur de scoring testé, rétrocompatible (paramètre optionnel, défaut 1).
- **Aucune vérification navigateur effectuée pour ce sprint v2**, à la
  demande explicite de l'utilisateur en cours de session : validation
  limitée à `tsc`, `eslint`, `vitest`, `next build`, et à des vérifications
  `curl` en local et en production (y compris un test réel de l'image OG
  edge qui a permis de détecter le bug Satori ci-dessus).

---

## v1 — MVP initial

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
