# Arborescence technique

```text
melissa-18h/
├── app.config.ts                  # nom et réglages produit modifiables
├── src/
│   ├── components/                # composants UX réutilisables
│   ├── screens/                   # 5 rubriques + mode séance
│   ├── data/                      # 120 QCM, sport, plateformes emploi
│   ├── services/                  # Firebase, sync, Push, IA, planning
│   └── styles.css
├── public/
│   ├── push-handler.js            # réception Web Push
│   └── icônes PWA
├── functions/
│   └── src/index.ts               # envoi des rappels programmés
├── docs/
├── firestore.rules
├── storage.rules
├── firestore.indexes.json
├── firebase.json
├── .github/workflows/ci.yml
├── .env.example
└── README.md
```
