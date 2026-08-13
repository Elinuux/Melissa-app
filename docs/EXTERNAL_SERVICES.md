# Services externes et coûts

## Nécessaires en production

### Firebase Authentication
Connexion email/mot de passe pour une seule utilisatrice. Pas d’inscription publique dans l’application.

### Cloud Firestore
Planning, candidatures, progression, paramètres, abonnements Push et jobs de notification.

### Firebase Storage
Phase 2 pour le CV et, en Phase 3, éventuellement l’audio temporaire.

### Firebase Hosting
HTTPS nécessaire pour la PWA et le Web Push.

### Firebase Functions + Cloud Scheduler
Nécessaires pour envoyer un rappel même lorsque l’application est fermée. Cela impose le plan Blaze. Pour une seule utilisatrice, le volume attendu reste minuscule, mais un budget/une alerte doit être configuré.

### GitHub
Dépôt privé + CI. Le déploiement Firebase Hosting pourra être branché via l’intégration officielle GitHub.

## Facultatifs

### Fournisseur IA
Aucun fournisseur imposé. `AIService` permet de brancher ultérieurement OpenAI ou un autre fournisseur côté serveur. Le coût dépendra du fournisseur et du volume. L’application Phase 1 continue de fonctionner sans IA.

## Non nécessaires
- compte Apple Developer pour le Web Push PWA ;
- serveur dédié ;
- base SQL ;
- numéro de téléphone ;
- service SMS.
