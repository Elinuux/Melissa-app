# Modèle Firestore

```text
users/{uid}
  preferences/main
  settings/{key}
  evenings/{eveningId}
  applications/{applicationId}
  sportSessions/{sessionId}
  englishProgress/{progressId}
  weights/{weightId}
  cvVersions/{versionId}            # Phase 2
  pushSubscriptions/{subscriptionId}
  notificationJobs/{jobId}
```

## `applications`
- company
- title
- url
- location
- date
- notes
- status : `À regarder | À postuler | Envoyée | Relance | Entretien | Terminée`
- createdAt
- nextAction / nextActionAt (phase suivante)

## `notificationJobs`
- title
- body
- kind : `today | jobs | sport | english`
- scheduledAt
- status : `pending | sent | cancelled | dismissed`
- createdAt
- snoozedAt / dismissedAt si applicable

## `pushSubscriptions`
- subscription : objet PushSubscription sérialisé
- userAgent
- createdAt

## `settings/{key}`
Petit document synchronisé pour les données compactes comme catégories d’anglais faibles ou préférences. Le stockage local reste un cache de confort, Firestore devient la source persistante quand Firebase est configuré.

## Storage — Phase 2/3
```text
users/{uid}/cv/original/...
users/{uid}/cv/versions/...
users/{uid}/audio/temp/...
```
