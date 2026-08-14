# Architecture définitive — Phase 1

## Produit
Une seule utilisatrice. Navigation à 5 entrées. Une action principale par écran. Le mode local fonctionne sans Firebase pour le développement; la production active Auth/Firestore/Storage/Push.

## Écrans
- Aujourd’hui → soirée → activité
- Alternance → recherche → candidature → assistant (Phase 2)
- Sport → choix séance → mode séance plein écran → bilan
- English → test/QCM → erreurs → entraînement
- Profil → rappels → données

## Technique
React + TypeScript + Vite + PWA. Firebase Auth, Firestore, Storage, Hosting et Functions. `AIService` est volontairement indépendant et désactivable.

## Notifications
Client : Push API standard avec clé VAPID publique. Abonnement stocké dans `users/{uid}/pushSubscriptions`.
Serveur : un job `notificationJobs` sous l’utilisateur; une Function planifiée récupère les jobs arrivés à échéance et envoie un Web Push. Payload déclaratif pour Safari récent + gestion Service Worker pour compatibilité.

## Limites iOS
- Web Push iPhone : application ajoutée à l’écran d’accueil + autorisation après geste utilisateur.
- Les boutons d’action directement dans la notification ne sont pas garantis sur toutes les versions iOS. Le clic ouvre donc l’activité, qui présente Commencer / +10 min / +30 min / Passer.
- L’exécution JS continue en arrière-plan n’est pas garantie : le minuteur doit être basé sur des timestamps, pas uniquement sur un `setInterval` (amélioration prévue avant recette Phase 1).
- Wake Lock est opportuniste; l’écran peut être verrouillé par iOS.

## Sans IA
Planning, recherche, candidatures, séances, minuteur, QCM locaux, historique, PWA/offline.

## Avec IA
Analyse d’annonce, CV, mails/messages, préparation entretien, génération ciblée d’anglais, analyse d’oral.
