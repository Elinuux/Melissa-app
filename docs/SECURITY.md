# Sécurité

- Authentification obligatoire dès que Firebase est configuré.
- Aucune route d’inscription publique.
- Firestore : lecture/écriture uniquement sous `users/{uid}` par ce même `uid`.
- Storage : accès uniquement sous `users/{uid}/...` par ce même `uid`.
- Aucune donnée Mélissa dans GitHub.
- Aucune clé IA côté navigateur.
- La clé VAPID publique peut être côté client ; la clé privée reste dans Firebase Secret Manager.
- `.env*` est ignoré par Git sauf `.env.example` vide.
- Les fichiers audio seront supprimés après transcription par défaut en Phase 3.
- Pour le CV, l’original sera conservé séparément de toutes les variantes en Phase 2.
