# System Prompt - Glimpse Project

Vous travaillez sur **Glimpse**, une PWA mobile-first où des célibataires partagent leurs dates à venir avec leurs amis proches qui agissent comme wingmen en suggérant des lieux, validant des choix et envoyant des conseils avant le date.

## Contexte Technique

### Stack
- **Frontend:** React 18 + TypeScript (strict) + Vite
- **Styling:** Tailwind CSS avec design system custom
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **Maps:** Google Maps avec `@vis.gl/react-google-maps`
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **PWA:** Vite PWA plugin

### Configuration Environnement
Toutes les variables sont dans `.env` :
- `VITE_SUPABASE_URL` - Instance Supabase configurée
- `VITE_SUPABASE_ANON_KEY` - Clé publique Supabase
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps
- `VITE_GOOGLE_MAPS_MAP_ID` - Map ID stylisée

La base de données est déjà provisionnée et configurée. Les migrations sont dans `supabase/migrations/`.

## Architecture Base de Données

### Tables Principales

**profiles**
- Étend `auth.users` de Supabase
- Colonnes: `id` (uuid), `email`, `display_name`, `avatar_url`, `created_at`, `updated_at`
- RLS: Users peuvent lire tous les profils, modifier uniquement le leur

**dates**
- Colonnes clés: `id`, `user_id`, `title`, `description`, `date_time`, `venue_name`, `venue_address`, `latitude`, `longitude`, `vibe`, `mood_tags`, `wingman_brief`, `visibility`, `status`
- `vibe` (ENUM): `romantic`, `casual`, `first_date`, `fun_festive`, `cozy`, `other`
- `visibility` (ENUM): `all_friends`, `selected_friends`, `private`
- `status` (ENUM): `upcoming`, `completed`, `cancelled`
- RLS: Owner a accès complet, amis peuvent lire selon visibility

**friendships**
- Relation bidirectionnelle avec `status` (`pending`, `accepted`, `blocked`)
- RLS: Les deux parties peuvent lire, seul l'initiateur peut modifier

**wingman_actions**
- Actions des amis: suggestions, validations, conseils
- `action_type` (ENUM): `suggestion`, `validation`, `advice`, `question`
- RLS: Date owner + amis autorisés peuvent lire, amis peuvent écrire

### Sécurité
- RLS activé sur TOUTES les tables
- Authentification via Supabase Auth (email/password + Google OAuth)
- Policies restrictives basées sur `auth.uid()`

## Design System

### Palette de Couleurs
```css
--color-ink: #0e0c0a        /* Fond principal */
--color-cream: #f8f3ec      /* Texte clair */
--color-pink: #d4486a       /* Actions principales */
--color-gold: #b8872a       /* Accents */
```

### Vibes & Couleurs
- **romantic** → Pink (#d4486a)
- **casual** → Gold (#b8872a)
- **first_date** → Purple (#a855f7)
- **fun_festive** → Orange (#f97316)
- **cozy** → Cyan (#22d3ee)
- **other** → Transparent/default

### Typographie
- **Playfair Display (italic)** - Logo, titres principaux
- **Cormorant Garamond** - Corps de texte
- **DM Mono** - UI labels, boutons

### Composants UI
- **Boutons:** Forme de pilule, texte uppercase mono
  - Primary: fond pink
  - Outline: transparent avec border
  - Ghost: fond semi-transparent
- **Cards:** Semi-transparentes avec `backdrop-blur-sm` et border subtile
- **Inputs:** Fond transparent, border cream/20, focus avec border pink
- **Badges:** Ronds, utilisés pour les avatars sur les pins

## Structure du Projet

```
src/
├── components/
│   ├── ui/                    # Button, Input, Card, Badge, Avatar, Chip
│   ├── layout/                # TopBar, BottomNav, PageWrapper
│   ├── map/                   # MapPin, DatePreviewCard
│   ├── date/                  # DateCard
│   ├── wingman/               # WingmanPanel, AdviceFeed
│   └── profile/               # ProfileDateCard, DeleteConfirmSheet
├── pages/
│   ├── AuthPage.tsx           # Auth email/password + Google OAuth
│   ├── HomePage.tsx           # Carte avec pins des dates
│   ├── NewDatePage.tsx        # Formulaire 3 étapes création date
│   ├── DateDetailPage.tsx     # Détail + wingman panel
│   └── ProfilePage.tsx        # Profil + gestion amis
├── stores/
│   ├── authStore.ts           # Auth state
│   ├── datesStore.ts          # Dates + CRUD
│   ├── friendsStore.ts        # Friendships
│   └── wingmanStore.ts        # Wingman actions
├── types/
│   └── index.ts               # Types globaux
├── utils/
│   └── mapStyles.ts           # Styles Google Maps custom
└── lib/
    └── supabase.ts            # Client Supabase
```

## Fonctionnalités Implémentées

### Page d'Authentification (AuthPage)
- Sign up / Sign in avec email/password
- Bouton Google OAuth
- Gestion erreurs et validation
- Redirection automatique si authentifié

### Page d'Accueil (HomePage)
- Google Maps avec pins pour chaque date
- Clustering intelligent des pins proches
- Pins colorés selon le vibe du date
- Animation "breathing" pour dates futures
- Badges avatar sur les pins (initiale de l'ami)
- Preview cards au clic avec infos résumées
- Navigation vers le détail du date

### Création de Date (NewDatePage)
- Formulaire en 3 étapes avec React Hook Form + Zod
- **Étape 1:** Sélection du vibe (6 options avec icônes)
- **Étape 2:** Lieu (Google Places Autocomplete), date/heure, mood tags
- **Étape 3:** Brief wingman, sélection amis, visibilité
- Validation stricte, soumission vers Supabase

### Détail de Date (DateDetailPage)
- Affichage complet des infos du date
- Wingman panel avec feed d'actions
- Possibilité d'ajouter conseils/suggestions (pour les amis)
- Carte miniature du lieu

### Profil (ProfilePage)
- Liste des dates de l'utilisateur (upcoming/completed)
- Stats et informations profil
- Gestion des amis
- Suppression de compte avec confirmation

## Patterns & Conventions

### State Management (Zustand)
Chaque store expose:
- State (données + loading/error)
- Actions (fetch, create, update, delete)
- Cleanup (reset store)

Exemple:
```typescript
interface DatesStore {
  dates: DateEntry[];
  loading: boolean;
  error: string | null;
  fetchDates: () => Promise<void>;
  createDate: (data: CreateDateData) => Promise<DateEntry>;
  // ...
}
```

### Supabase Queries
- Utiliser `.maybeSingle()` au lieu de `.single()` pour éviter les erreurs
- Toujours vérifier `error` avant d'utiliser `data`
- RLS gère automatiquement les permissions

### Responsive Mobile-First
- Design pour 390px de large (iPhone 12/13/14)
- Utiliser `max-w-md mx-auto` pour centrer sur desktop
- Touch-friendly (boutons min 44px)

### Maps
- Utiliser `@vis.gl/react-google-maps` (pas `@react-google-maps/api`)
- Styles custom dans `mapStyles.ts`
- Clustering via `MarkerClusterer`

## Instructions Spéciales

### Quand créer/modifier du code:

1. **TOUJOURS lire les fichiers existants** avant de les modifier
2. **Suivre le design system** (couleurs, fonts, composants)
3. **Respecter la structure** (pas de nouveaux dossiers sans raison)
4. **Valider TypeScript** (`npm run typecheck`) avant de terminer
5. **Builder le projet** (`npm run build`) pour vérifier qu'il n'y a pas d'erreurs
6. **Utiliser les stores Zustand** pour le state (pas de Context API)
7. **RLS first** - Ne jamais créer de table sans RLS policies
8. **Mobile-first** - Toujours penser viewport 390px

### Quand ajouter des features:

- **Vérifier si un composant/store existe déjà** avant d'en créer un nouveau
- **Réutiliser les composants UI** existants (Button, Input, Card, etc.)
- **Ajouter les types** dans `src/types/index.ts`
- **Migrations SQL** pour tout changement de schema (via `supabase/migrations/`)
- **Tester l'auth** - Toutes les pages sauf Auth nécessitent l'authentification

### Style de Code:

- **TypeScript strict** (pas de `any`, typer tout)
- **Functional components** avec hooks
- **Named exports** (pas de default exports sauf pour les pages)
- **Tailwind classes** (pas de CSS custom sauf nécessaire)
- **Destructuring** dans les props
- **Arrow functions** pour les composants

### Commandes Utiles:

```bash
npm run dev        # Dev server
npm run build      # Build production
npm run typecheck  # Vérifier les types
npm run preview    # Preview du build
```

## Points d'Attention

### Google Maps
- L'API Key est configurée mais a des restrictions de domaine
- Le Map ID définit les styles custom (dark theme)
- Toujours wrapper dans `APIProvider`

### Supabase Realtime
- Activé sur la table `wingman_actions` pour les notifications temps réel
- Utiliser `.on('postgres_changes')` pour écouter les changements

### PWA
- Configuration dans `vite.config.ts`
- Icons dans `/public/`
- Service worker auto-généré

### Performances
- Le bundle est large (500KB+) à cause de Google Maps
- Considérer le code splitting si nécessaire
- Images optimisées, pas de photos lourdes

## État du Projet

### Complété
- ✅ Architecture base de données avec RLS
- ✅ Authentification (email + Google OAuth)
- ✅ Stores Zustand (auth, dates, friends, wingman)
- ✅ Page d'accueil avec carte interactive
- ✅ Création de dates (formulaire complet)
- ✅ Détail de dates avec wingman panel
- ✅ Profil utilisateur
- ✅ Design system complet
- ✅ PWA configuration

### À Améliorer/Ajouter
- Notifications push (PWA)
- Gestion des invitations amis (actuellement basique)
- Upload d'avatar utilisateur
- Photos des lieux/dates
- Recherche et filtres sur la carte
- Stats et insights sur les dates
- Messages directs entre amis

## Debugging

### Erreurs Communes

**Build TypeScript:**
```bash
npm run typecheck
```

**Erreur Supabase RLS:**
Vérifier que l'utilisateur est authentifié et que les policies permettent l'action.

**Maps ne s'affiche pas:**
Vérifier que `VITE_GOOGLE_MAPS_API_KEY` est définie et valide.

**Store Zustand ne se met pas à jour:**
S'assurer d'appeler les actions du store (pas de mutation directe du state).

## Ressources

- [Supabase Docs](https://supabase.com/docs)
- [React Google Maps](https://visgl.github.io/react-google-maps/)
- [Zustand](https://docs.pmnd.rs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Note importante:** Ce projet utilise Supabase pour TOUT le backend. Ne pas créer de routes API Express/Node. Tout passe par le client Supabase en frontend avec RLS pour la sécurité.
