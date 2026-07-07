# Méthodologie de rédaction des thèses

Ce document décrit comment formuler une thèse neutre pour matcher-2027. Il s'inspire
directement des lignes éditoriales du Wahl-O-Mat allemand (Bundeszentrale für politische
Bildung), adaptées au contexte français.

## Principes

1. **Une thèse = une proposition, pas une question.** La thèse est un énoncé sur lequel
   l'utilisateur et les candidats se positionnent (d'accord / neutre / pas d'accord), jamais
   une question ouverte.

2. **Formulation symétrique.** La thèse doit pouvoir être approuvée ou rejetée sans que sa
   formulation ne favorise l'une des deux réponses. On évite les adjectifs connotés
   ("scandaleux", "indispensable", "dangereux") et les questions orientées ("Ne pensez-vous
   pas que...").
   - Mauvais : "Le gouvernement doit enfin réduire les impôts qui étouffent les entreprises."
   - Bon : "Les impôts sur les grandes entreprises doivent être augmentés pour financer les
     services publics."

3. **Un seul enjeu par thèse.** Pas de propositions à tiroirs ("La France doit augmenter le
   budget de la défense ET réformer les retraites"). Si un sujet a deux dimensions
   controversées distinctes, on écrit deux thèses.

4. **Testable et sourcé.** Chaque thèse doit correspondre à un sujet sur lequel on peut
   raisonnablement trouver une position documentée d'un candidat (programme, vote, interview).
   On évite les thèses trop abstraites ou philosophiques qui ne débouchent sur aucune
   politique concrète.

5. **Contexte neutre, pas argumentaire.** Le champ `explanation` donne à l'utilisateur le
   contexte nécessaire pour comprendre l'enjeu (définitions, ordres de grandeur, débat en
   cours), sans plaider pour un camp. Les arguments pour et contre, s'ils sont mentionnés,
   doivent être présentés à parité.

6. **Actualité et portée nationale.** Les thèses portent sur des enjeux de politique nationale
   ou de politique étrangère française, pertinents pour une élection présidentielle — pas sur
   des sujets locaux ou de gestion administrative fine.

7. **Répartition par catégorie.** Les thèses sont réparties en 6 catégories (Économie,
   International, Écologie, Institutions, Société, Éducation) avec un nombre équilibré de
   thèses par catégorie, pour éviter qu'une thématique ne domine le résultat.

## Processus de relecture

Avant publication, chaque thèse est relue en vérifiant :

- Peut-elle être retournée (inversée dans sa formulation) sans changer le sens du débat ? Si
  la version inversée semble "bizarre" ou moins naturelle que l'originale, la formulation est
  probablement biaisée.
- Un partisan de n'importe quel bord politique peut-il lire la thèse sans se sentir visé par
  le choix des mots ?
- La thèse correspond-elle à un vrai clivage (au moins deux candidats avec des positions
  clairement différentes) ou est-elle consensuelle au point de ne rien apporter au
  classement ?

## Statut pour ce MVP

Les 30 thèses actuelles ainsi que les positionnements des 4 candidats sont des **données
fictives** créées pour valider l'ossature technique. Elles suivent ces règles de formulation
mais ne doivent pas être lues comme une analyse politique réelle. La collecte de vraies
thèses et positions, sourcées auprès de vrais candidats, fera l'objet d'une phase éditoriale
ultérieure documentée dans `/methodologie`.
