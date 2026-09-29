# Contribuer

## Branches

| Branche   | Rôle                                   | Déploiement                  |
|-----------|----------------------------------------|------------------------------|
| `prod`    | Code en production                     | Vercel — production                     |
| `preprod` | Préparation / recette (branche par défaut) | Vercel — preview              |

Aucun push direct sur `prod` ni `preprod` : tout passe par une Pull Request.

## Workflow

1. Partir de `preprod` à jour :
   ```bash
   git switch preprod && git pull
   git switch -c feat/ma-fonctionnalite   # ou fix/..., refactor/..., chore/...
   ```
2. Commiter en suivant [Conventional Commits](https://www.conventionalcommits.org/fr) (`feat: ...`, `fix: ...`).
3. Pousser et ouvrir une PR **vers `preprod`**. La CI doit passer avant le merge.
4. Une fois `preprod` validée, ouvrir une PR **`preprod` → `prod`** (release).
   La CI refuse toute PR vers `prod` qui ne vient pas de `preprod`.

## CI/CD (GitHub Actions)

- `.github/workflows/ci.yml` — sur chaque PR vers `preprod`/`prod` : `npm run lint` et `npm run build` (type-check TypeScript inclus)
- `.github/workflows/cd.yml` — sur chaque push (= merge) sur `preprod`/`prod` : relance la CI puis déploie.

### Configuration requise sur GitHub

**Settings → Environments** : créer `preprod` et `production` avec les secrets :
- `VERCEL_TOKEN` — Vercel → Account Settings → Tokens
- `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — fichier `.vercel/project.json` après `npx vercel link`

Sur Vercel, définir `VITE_API_URL` pour les environnements *Preview* (API préprod) et *Production* (API prod), et désactiver le déploiement Git automatique.

**Settings → Branches** (ou *Rules → Rulesets*), pour `prod` et `preprod` :
- Require a pull request before merging
- Require status checks to pass : `Branch policy`, `Lint & build`
- Block force pushes / deletions
