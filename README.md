# Mélissa app

Application personnelle PWA, mobile-first, pensée d’abord pour iPhone. Elle aide Mélissa à répartir ses soirées entre alternance, sport et anglais sans créer une nouvelle charge mentale.

## Fonctionnalités principales

### Aujourd’hui
- Greeting dynamique selon l’heure locale : Bonjour / Bon après-midi / Bonsoir Mélissa.
- Planning du soir et générateur simple selon le temps disponible et l’énergie.
- Vue synthétique de la progression de la semaine.

### Alternance
- Recherche large et visible, avec suggestions et liens officiels vers les plateformes emploi.
- Suivi simple des candidatures.
- Espace **Mon CV** intégré :
  - import PDF ou DOCX depuis l’iPhone ;
  - fichier original conservé intact dans IndexedDB ;
  - sections éditables, ajoutables, supprimables et réordonnables ;
  - aperçu PDF ;
  - export PDF via la feuille d’impression/partage iOS ;
  - assistant IA facultatif avec propositions Avant / Après.

### Sport
- Séances prêtes à l’emploi.
- Minuteur basé sur des timestamps réels : il reprend correctement après changement d’écran ou retour dans l’app.
- État de la séance persisté localement.
- Chrono global d’entraînement en haut du mode séance.
- Pause, reprise, précédent, suivant, +10 s et arrêt.
- Guides d’exécution pour les mouvements avec muscles, consignes, erreurs fréquentes et lien vidéo.

### English
- Évaluation initiale de 20 questions.
- Niveau de travail mémorisé : A2, B1, B1+ ou B2.
- Sessions courtes ciblées : grammaire, Business English, finance, emails, entretien, révision rapide.
- Historique des erreurs regroupé par notion et entraînement ciblé.
- Mini-leçons avec synthèse vocale pour écouter les phrases.
- Rubrique Speaking : réponse rapide, challenge 1 minute, entretien, finance et écoute/répète.
- Enregistrement et réécoute du micro même sans IA.

### Design / iPhone
- Identité **Mélissa app** avec logo dédié.
- Palette différente par rubrique tout en gardant un design system commun.
- Mode sombre automatique.
- Bottom navigation réellement fixe avec prise en charge des safe areas iOS.
- PWA standalone et cache applicatif.

## Stack
- React
- TypeScript strict
- Vite
- `vite-plugin-pwa`
- Firebase Authentication
- Firestore
- Firebase Storage
- Firebase Functions
- Firebase Hosting

## Installer localement

```bash
npm install
npm install --prefix functions
cp .env.example .env.local
npm run dev
```

Build complet du client :

```bash
npm run build
```

Tests :

```bash
npm test
```

Vérification des Functions :

```bash
npm run build --prefix functions
```

## Firebase

Le projet actuel est `melissa-app-c3eb6`.

Pour une installation neuve :
1. créer le projet Firebase ;
2. activer Authentication > Email/Password ;
3. créer Firestore ;
4. activer Storage et Hosting ;
5. créer uniquement le compte de Mélissa, sans inscription publique ;
6. configurer les variables `VITE_FIREBASE_*` si les valeurs par défaut du projet ne sont pas utilisées ;
7. déployer les règles.

Les règles Firestore limitent les données de `/users/{uid}` à l’utilisatrice authentifiée correspondante.

## Déploiement courant

Dans le Cloud Shell déjà configuré, la commande courte prévue pour le propriétaire est :

```bash
npm run h
```

Elle fait automatiquement :
1. `git pull` ;
2. build client ;
3. déploiement Hosting ;
4. déploiement des règles/indexes Firestore.

Les Functions sont volontairement déployées séparément pour éviter d’exiger des secrets IA quand l’IA n’est pas utilisée.

## Notifications iPhone

La PWA utilise le Web Push standard. L’app doit être ajoutée à l’écran d’accueil sur iPhone avant de demander les notifications.

Générer les clés VAPID :

```bash
npx web-push generate-vapid-keys
```

Configurer côté client :

```text
VITE_WEB_PUSH_PUBLIC_KEY=...
```

Configurer les secrets serveur :

```bash
firebase functions:secrets:set WEB_PUSH_PUBLIC_KEY
firebase functions:secrets:set WEB_PUSH_PRIVATE_KEY
```

Puis construire les Functions et déployer le scheduler :

```bash
npm install --prefix functions
npm run build --prefix functions
firebase deploy --only functions:sendDueNotifications
```

## IA facultative

L’app fonctionne normalement sans IA. Planning, candidatures, CV manuel, sport, minuteurs, questions d’anglais et oral local restent disponibles.

### Architecture

`src/services/aiService.ts` expose une couche `AIService` indépendante du fournisseur. Les fournisseurs prévus sont :
- `openai`
- `gemini`
- `claude`

Aucune clé IA n’est placée dans le client ni dans GitHub. Les clés restent dans Firebase Secret Manager et sont lues uniquement dans les Functions.

### Activer un fournisseur

Dans `.env.local` :

```text
VITE_AI_ENABLED=true
VITE_AI_PROVIDER=openai
```

Remplacer `openai` par `gemini` ou `claude` si nécessaire.

#### OpenAI

```bash
firebase functions:secrets:set OPENAI_API_KEY
npm run build --prefix functions
firebase deploy --only functions:aiAssistOpenAI
```

#### Gemini

```bash
firebase functions:secrets:set GEMINI_API_KEY
npm run build --prefix functions
firebase deploy --only functions:aiAssistGemini
```

#### Claude

```bash
firebase functions:secrets:set ANTHROPIC_API_KEY
npm run build --prefix functions
firebase deploy --only functions:aiAssistClaude
```

Il suffit de déployer le fournisseur réellement utilisé. Si l’IA n’est pas configurée, l’interface affiche un message compréhensible et ne modifie aucune donnée.

### Règle CV

Les prompts serveur imposent de ne jamais inventer :
- expérience ;
- diplôme ;
- compétence ;
- logiciel ;
- niveau linguistique ;
- résultat professionnel.

Les améliorations du CV restent des suggestions à accepter ou refuser.

## CV

Le fichier original est conservé séparément des sections éditables. Une modification dans l’éditeur ne remplace jamais automatiquement le fichier importé.

- PDF : aperçu intégré lorsqu’il est pris en charge par le navigateur.
- DOCX : original conservé et téléchargeable ; l’édition structurée reste indépendante du fichier source.
- Export PDF : la version éditée ouvre une vue A4 imprimable, utilisable avec la feuille de partage iOS.

## Sport : persistance du minuteur

Le mode séance n’utilise pas uniquement un `setInterval`. Il enregistre notamment :
- l’exercice courant ;
- le timestamp de fin du bloc ;
- le temps global déjà effectué ;
- l’état pause / lecture.

Ainsi, lorsque l’app revient au premier plan, le temps réel écoulé est recalculé et la séance peut avancer aux blocs suivants sans perdre les minutes déjà faites.

## English : contenu local

`src/data/englishQuestions.ts` fournit la bibliothèque de questions locale.

`src/data/englishContent.ts` contient les parcours, mini-leçons et modes d’oral. Le fonctionnement de base ne dépend pas d’une IA externe.

## Ajouter / modifier du contenu

- recherches emploi : `src/data/jobs.ts`
- exercices et séances sport : `src/data/sport.ts`
- questions d’anglais : `src/data/englishQuestions.ts`
- parcours / oral anglais : `src/data/englishContent.ts`
- nom de l’application : `app.config.ts`
- thèmes et UI : `src/styles.css` et `src/featureStyles.css`

## Tester sur iPhone

À vérifier avant chaque version importante :
1. ouverture dans Safari ;
2. installation sur l’écran d’accueil ;
3. lancement standalone ;
4. mode clair et sombre ;
5. navigation basse pendant un long scroll ;
6. session sport, sortie puis reprise ;
7. microphone dans English > Speaking ;
8. import PDF/DOCX depuis Fichiers ;
9. export/partage du CV ;
10. notifications si elles sont configurées.

## CI GitHub

`.github/workflows/ci.yml` vérifie :
- installation du client ;
- build TypeScript/Vite ;
- tests ;
- installation des dépendances Functions ;
- compilation TypeScript des Functions.

Aucun secret n’est nécessaire pour compiler la CI.

## Erreurs fréquentes

- **Notifications indisponibles** : vérifier que l’app est lancée depuis l’icône PWA et non dans un onglet classique.
- **Permission microphone refusée** : autoriser le microphone pour Mélissa app dans les réglages iPhone.
- **Fonction IA indisponible** : vérifier `VITE_AI_ENABLED`, `VITE_AI_PROVIDER`, le secret correspondant et le déploiement de la Function choisie.
- **CV non prévisualisé** : les DOCX sont conservés mais ne sont pas rendus nativement par tous les navigateurs ; utiliser les sections éditables.
- **Firebase non accessible** : l’app garde autant que possible un fonctionnement local/offline partiel.

Voir aussi `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md` et `docs/PHASES.md`.
