# matcher-2027 — Design (MVP ossature technique)

Statut : spec fournie intégralement par l'utilisateur en un seul brief, validation intermédiaire
explicitement déclinée ("enchaîne sans validation intermédiaire"). Ce document consigne ce brief
comme spec de référence avant l'implémentation, sans repasser par un cycle de questions/réponses.

## Contexte

MVP d'un comparateur de programmes pour la présidentielle française 2027, inspiré du Wahl-O-Mat
allemand. Objectif du sprint : ossature technique déployée avec données de test (fictives). La
collecte réelle de programmes est une phase ultérieure, hors scope.

## Stack

- Next.js 15 (App Router, TypeScript strict), Tailwind, shadcn/ui
- Pas de base de données : données dans `/content` en JSON versionnés (1 candidat = 1 fichier JSON)
- Déploiement Vercel, PWA (manifest + service worker, cache offline)
- pnpm, commits conventionnels

## Modèle de données (Zod)

- `Thesis`: id, category, statement, explanation
- `Candidate`: id, name, party, portrait_url, official_program_url
- `Position`: candidate_id, thesis_id, stance (-2..+2), source_url, source_type (programme|vote|interview), source_quote, source_date
- `UserAnswer`: thesis_id, stance (-2..+2), weight (0|1|2)

## Flow utilisateur

1. Landing : accroche, CTA "Commencer le test (5 min)", lien "Méthodologie"
2. Questionnaire : 30 thèses, un écran par thèse (D'accord/Neutre/Pas d'accord/Passer),
   checkbox "Sujet important pour moi" (double le poids), barre de progression
3. Résultat : classement par % d'affinité, radar par catégorie, drill-down thèse par thèse
   (réponse user vs candidat + source)
4. Partage : image OG dynamique top 3, lien vers méthodologie

## Calcul d'affinité

- Distance normalisée user/candidat par thèse répondue (skip ignoré)
- Pondération par le poids "important pour moi"
- Score final en %, intervalle de confiance selon nombre de thèses skippées
- 100% côté client, aucune donnée ne quitte le navigateur

## RGPD & neutralité (non négociable)

- Bannière footer permanente : aucune collecte, outil de comparaison pas de recommandation de vote
- `/methodologie` : sources, grille de positionnement, gouvernance, disclosure d'engagement politique
  de l'auteur (parti Horizons)
- `/sources` : chaque position renvoie à sa source primaire (URL, date, citation)

## Données seed (fictives, ce MVP uniquement)

- 4 candidats fictifs (Alpha/Beta/Gamma/Delta), pas de vrais noms/partis
- 30 thèses, 6 catégories (Économie, International, Écologie, Institutions, Société, Éducation),
  formulation neutre et symétrique
- `content/thesis-guidelines.md` : méthodologie de rédaction neutre (référence Wahl-O-Mat)

## UI/UX

- Sobre, typographique, inspiré Are.na / Kagi / Rauch. Pas de dégradés ni ombres inutiles.
- Mobile-first strict (testé 375px), un écran à la fois pendant le questionnaire, transitions douces
- Accessibilité : clavier complet, ARIA, contraste AA

## PWA

- Manifest complet, icônes 192/512, thème couleur cohérent
- Service worker cache-first pour usage offline complet

## Hors scope explicite

Pas de scraping, pas de DB, pas d'auth, pas d'analytics, pas de vrais candidats/positions,
pas de tests E2E (seul un test unitaire sur le scoring).

## Livrables

- Repo public GitHub "matcher-2027" (via `gh`)
- Déploiement Vercel
- README bilingue FR/EN (concept, inspiration, statut MVP, méthodologie prévue, roadmap)
- `ETAT.md` (fait / à faire / décisions)

## Contraintes d'exécution

- Enchaîner sans validation intermédiaire ; dégrader le scope si blocage > 10 min
- Budget 3h max
- Aucune mention de vrais partis/candidats/personnalités dans le code ou les données seed
