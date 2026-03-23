# Glimpse

**Tagline:** Let your people pick your person

A mobile-first PWA where singles share upcoming dates with close friends who act as their wingmen: suggesting venues, validating choices, and sending advice before the date happens.

## Tech Stack

- **Framework:** React 18 + Vite
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + CSS variables
- **Backend:** Supabase (database + auth + realtime)
- **Auth:** Supabase Auth (email/password + Google OAuth)
- **State Management:** Zustand
- **Routing:** React Router v6
- **PWA:** Vite PWA plugin
- **Forms:** React Hook Form + Zod validation

## Project Structure

```
src/
  components/
    ui/          # Button, Input components
    layout/      # BottomNav, TopBar, PageWrapper (to be built)
    map/         # MapView, MapPin, DatePreviewCard (to be built)
    date/        # DateForm, DateCard, DateDetail (to be built)
    wingman/     # WingmanPanel, AdviceFeed, ActionButtons (to be built)
  pages/
    AuthPage.tsx           # ✅ Email/password + Google OAuth
    HomePage.tsx           # ✅ Placeholder (Map view to be built)
    DateDetailPage.tsx     # ⏳ To be built
    NewDatePage.tsx        # ⏳ To be built
    ProfilePage.tsx        # ⏳ To be built
  stores/
    authStore.ts           # ✅ Authentication state
    datesStore.ts          # ⏳ To be built
    wingmanStore.ts        # ⏳ To be built
  lib/
    supabase.ts            # ✅ Supabase client
    maps.ts                # ⏳ To be built (Google Maps integration)
  types/
    index.ts               # ✅ TypeScript types
```

## Database Schema

### Tables

- **profiles** - User profiles (extends Supabase auth.users)
- **friendships** - Friend connections (pending/accepted)
- **dates** - Date entries with venue details
- **wingman_actions** - Friend suggestions, validations, and advice

### Security

All tables have Row Level Security (RLS) enabled:
- Profiles: Readable by authenticated users, writable by owner
- Friendships: Readable by both parties, writable by initiator
- Dates: Owner has full access, friends can read based on visibility
- Wingman Actions: Readable by date owner + friends, writable by friends

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone le projet depuis Git
2. Installe les dépendances :

```bash
npm install
```

3. Configure les variables d'environnement :

```bash
cp .env.example .env
```

Le fichier `.env.example` contient déjà toutes les clés configurées pour :
- **Supabase** - Base de données et authentification (déjà configurée)
- **Google Maps** - Carte interactive (déjà configurée)

**Note:** Les variables d'environnement sont déjà pré-remplies dans `.env.example`. Il suffit de copier le fichier.

### Development

```bash
npm run dev
```

Le projet démarre sur `http://localhost:5173`

### Build

```bash
npm run build
```

### Type Check

```bash
npm run typecheck
```

## Configuration Supabase

Le projet est déjà connecté à une instance Supabase configurée avec :

- Base de données PostgreSQL avec toutes les tables
- Row Level Security (RLS) activé sur toutes les tables
- Authentification email/password activée
- Google OAuth configuré

### Structure de la base de données

Toutes les migrations sont dans `supabase/migrations/` :
- `20260319143742_create_glimpse_schema.sql` - Schema initial
- Dernière migration avec ajout de la colonne `vibe`

Pour voir les tables existantes, tu peux utiliser l'interface Supabase ou les outils MCP intégrés dans Bolt.

## Authentication

### Email/Password

✅ **Implemented** - Users can sign up and sign in with email and password.

### Google OAuth

✅ **Implemented** - Google OAuth button is in place.

**To enable Google OAuth:**

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Authentication** → **Providers**
3. Enable **Google** provider
4. Follow Supabase's guide to set up Google OAuth credentials
5. The app will automatically work with Google sign-in once configured

## Design System

### Colors

- **ink** - Main background (#0e0c0a)
- **cream** - Light text/background (#f8f3ec)
- **pink** - Primary actions (#d4486a)
- **gold** - Accents (#b8872a)

### Typography

- **Display:** Playfair Display (italic) - Logo, headings
- **Body:** Cormorant Garamond - Content text
- **Mono:** DM Mono - UI labels, buttons

### Components

- **Buttons:** Pill-shaped with uppercase mono font
  - Primary: Pink background
  - Outline: Transparent with border
  - Ghost: Light background

- **Cards:** Semi-transparent with subtle border and backdrop blur

## Current Status

### ✅ Completed

- Project scaffolding with Vite + React + TypeScript
- Tailwind CSS design system
- Supabase database schema with RLS
- Authentication store (Zustand)
- Auth page with email/password and Google OAuth
- Protected routing
- PWA configuration

### ⏳ Next Steps

As requested, **only the Auth screen has been built**. The following screens need to be implemented:

1. **Home Page** - Map view with date markers
2. **Date Detail Page** - Wingman panel with advice feed
3. **New Date Page** - 3-step form for creating dates
4. **Profile Page** - User settings and friend management

## Notes

- This is a mobile-first PWA designed for 390px width viewport
- All data comes from Supabase (no mocked data)
- The project follows strict TypeScript and uses only the specified dependencies
- Authentication is working and ready to test once Google OAuth is configured in Supabase
