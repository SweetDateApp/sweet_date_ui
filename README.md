# Sweet Date — Frontend React + Vite + TypeScript + Tailwind

[![CI](https://github.com/SweetDateApp/sweet_date_ui/actions/workflows/ci.yml/badge.svg?branch=preprod)](https://github.com/SweetDateApp/sweet_date_ui/actions/workflows/ci.yml) [![CD preprod](https://github.com/SweetDateApp/sweet_date_ui/actions/workflows/cd.yml/badge.svg?branch=preprod)](https://github.com/SweetDateApp/sweet_date_ui/actions/workflows/cd.yml?query=branch%3Apreprod) [![CD prod](https://github.com/SweetDateApp/sweet_date_ui/actions/workflows/cd.yml/badge.svg?branch=prod)](https://github.com/SweetDateApp/sweet_date_ui/actions/workflows/cd.yml?query=branch%3Aprod)

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

## Scripts

| Commande | Rôle |
|----------|------|
| `npm run dev` | Serveur de développement |
| `npm run lint` | ESLint |
| `npm run build` | Type-check TypeScript + build de production |

## Structure
```
src/
├── App.tsx                 — Intro → connexion → application (navigation par état)
├── pages/
│   ├── DateFlowPage.tsx    — Parcours de création d'un rendez-vous
│   └── ProfilePage.tsx     — Onglets : mes dates, statistiques, paramètres
├── components/
│   ├── LoadingScreen.tsx, LoginPage.tsx, Navbar.tsx, Avatar.tsx
│   ├── date-flow/          — Une étape du parcours par composant (Step*)
│   └── profile/            — DatesList, ActivityChart, AccountSettings
├── hooks/
│   ├── useDateFlow.ts      — État du parcours (reducer) ; le plan est enregistré à la dernière étape
│   ├── useDatePlans.ts     — Plans du profil : liste, suppression, envoi d'invitation
│   └── useHeartCursor.ts   — Effet curseur cœurs flottants
├── context/                — AuthProvider + useAuth (JWT, session persistante)
├── lib/
│   ├── api.ts              — Client HTTP avec auto-refresh JWT
│   └── format.ts           — Formatage des dates/heures en français
└── types/index.ts          — Types et liste des activités
```

## Déploiement (Vercel)

Déclenché par GitHub Actions (voir `CONTRIBUTING.md`). Définir `VITE_API_URL` dans les
variables d'environnement Vercel (*Preview* → API préprod, *Production* → API prod).
