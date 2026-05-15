# Sweet Date — Frontend React + Vite + TypeScript + Tailwind

## Installation

```bash
npm install

# Copier et configurer l'URL de l'API
cp .env.example .env.local
# Éditer VITE_API_URL si nécessaire

npm run dev       # http://localhost:5173
npm run build     # Build de production
```

## Variable d'environnement
```
VITE_API_URL=http://localhost:8000/api
```

## Structure
```
src/
├── components/
│   ├── LoadingScreen.tsx   — Écran de chargement animé
│   ├── LoginPage.tsx       — Connexion + Inscription (avec 2 emails partenaires)
│   └── HomePage.tsx        — Flow romantique complet avec API
├── context/
│   └── AuthContext.tsx     — Gestion JWT, session persistante
├── hooks/
│   └── useHeartCursor.ts   — Effet curseur coeurs flottants
├── lib/
│   └── api.ts              — Client HTTP avec auto-refresh JWT
└── types/
    └── index.ts            — Types TypeScript
```
