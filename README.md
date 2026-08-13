# Mélissa 18h
Application personnelle PWA, mobile-first, pensée d’abord pour iPhone.

## Ce qui existe déjà
- Onboarding très court, connexion mono-utilisatrice et accueil/générateur de soirée adaptatif simple.
- Navigation à 5 rubriques.
- Liens d’emploi officiels et suivi de candidatures local.
- Bibliothèque sportive + vrai mode séance plein écran.
- 120 questions d’anglais locales, orientées Business English.
- PWA installable, cache applicatif, mode sombre.
- Socle Firebase et règles privées.
- Web Push iPhone via Push API standard + Firebase Functions, avec bouton de test.
- `AIService` découplé et désactivable.

## Installer
```bash
npm install
cd functions && npm install && cd ..
cp .env.example .env.local
npm run dev
```

## Firebase
1. Créer un projet Firebase.
2. Activer Authentication > Email/Password, Firestore, Storage et Hosting.
3. Créer **un seul compte** pour Mélissa dans Authentication. Ne pas ajouter d’écran d’inscription public.
4. Copier la configuration Web Firebase dans `.env.local`.
5. Initialiser le projet : `firebase login` puis `firebase use --add`.
6. Déployer règles et indexes : `firebase deploy --only firestore,storage`.

## Notifications iPhone
Le choix retenu est le Web Push standard, mieux aligné avec les PWA iOS, tout en gardant Firebase pour le backend.

Générer les clés VAPID :
```bash
npx web-push generate-vapid-keys
```
Mettre la clé publique dans `VITE_WEB_PUSH_PUBLIC_KEY`. Ajouter les deux secrets côté Functions :
```bash
firebase functions:secrets:set WEB_PUSH_PUBLIC_KEY
firebase functions:secrets:set WEB_PUSH_PRIVATE_KEY
```
Déployer :
```bash
firebase deploy --only functions,hosting
```
Les Functions nécessitent le plan Blaze. Pour une seule utilisatrice, l’usage devrait normalement rester dans les quotas gratuits; surveiller tout de même le budget Firebase/Google Cloud.

## Tester sur iPhone
1. Ouvrir l’URL HTTPS dans le navigateur.
2. Ajouter à l’écran d’accueil.
3. Ouvrir l’icône installée.
4. Profil > Activer les rappels.
5. Accepter l’autorisation.

## Modifier le nom
Modifier uniquement `app.config.ts`, puis reconstruire. Le nom affiché et le manifeste PWA utilisent cette configuration commune.

## Ajouter une recherche emploi
`src/data/jobs.ts`.

## Ajouter une vidéo / un exercice sportif
`src/data/sport.ts`. En production, remplacer les URLs de recherche YouTube par une bibliothèque de vidéos validées une à une.

## Ajouter des questions d’anglais
`src/data/englishQuestions.ts`. Chaque objet contient : question, choix, bonne réponse, explication, catégorie, difficulté.

## IA facultative
`src/services/aiService.ts` définit le contrat. Ne jamais mettre de clé IA dans `VITE_*`; les secrets IA doivent rester dans Firebase Functions/Secret Manager.

## Sauvegarde / restauration
Firestore synchronise les données une fois branché. Le mode local actuel utilise `localStorage` pour les candidatures de démonstration. Avant production, le repository devra basculer ces écritures vers Firestore et conserver le local uniquement comme cache de secours.

## Déployer
```bash
npm run build
firebase deploy
```

## GitHub Actions
Le workflow est fourni dans `.github/workflows/ci.yml`. La connexion Firebase Hosting/GitHub pourra ensuite être créée avec `firebase init hosting:github` afin de laisser Firebase créer les secrets de déploiement correctement.

## Erreurs fréquentes
- **Notifications indisponibles** : vérifier que l’app est lancée depuis l’icône de l’écran d’accueil et non dans un simple onglet.
- **Permission refusée** : réactiver les notifications de la web app dans les réglages iPhone.
- **PUSH_NOT_CONFIGURED** : la clé VAPID publique manque.
- **Firebase non configuré** : l’app reste en mode local de développement.

Voir `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md`, `docs/PHASES.md`.
