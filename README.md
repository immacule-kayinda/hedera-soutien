# HandiHelp

Application Next.js (App Router) avec TailwindCSS / ShadCN UI, Prisma et PostgreSQL.

## Prérequis

- Node.js ≥ 18
- pnpm
- PostgreSQL

## Installation rapide

1. **Installer les dépendances**
   ```powershell
   Set-Location "c:\Users\Silikin Store\projects\handihelp"; pnpm install
   ```
2. **Configurer l'environnement**
   - Copier `.env.example` en `.env`
   - Adapter les identifiants PostgreSQL (`DATABASE_URL`)
3. **Créer la base**
   ```sql
   CREATE DATABASE handihelp;
   ```
4. **Appliquer le schéma Prisma**
   ```powershell
   Set-Location "c:\Users\Silikin Store\projects\handihelp"; pnpm prisma migrate dev --name init
   ```
5. **Démarrer le serveur**
   ```powershell
   Set-Location "c:\Users\Silikin Store\projects\handihelp"; pnpm dev
   ```

## Structure notable

- `app/api/register/route.ts` : endpoint unique pour l'inscription (bénéficiaire ou donateur)
- `app/api/login/route.ts` : endpoint de connexion
- `contexts/AuthContext.tsx` : provider React utilisant ces endpoints
- `services/auth.ts` : service HTTP mutualisé
- `prisma/schema.prisma` : schéma Prisma

## Authentification (MVP)

- Enregistrement : `/api/register`
- Connexion : `/api/login`
- Hash des mots de passe avec `bcryptjs`
- Stockage des utilisateurs dans la table `User`

## Prochaines étapes conseillées

- Renforcer la gestion de session (cookies sécurisés, JWT, etc.)
- Ajouter des validations côté client/serveur supplémentaires
- Mettre en place des tests (unitaires/E2E) dès que la base est stable
