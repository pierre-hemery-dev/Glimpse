# Guide de Setup pour Collaborateurs

## Récupération du projet

### 1. Clone le repository Git dans Bolt

Une fois le projet cloné dans ta session Bolt, suis ces étapes :

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration des variables d'environnement

Le fichier `.env.example` contient toutes les clés nécessaires :

```bash
cp .env.example .env
```

**Toutes les clés sont pré-configurées** :
- Supabase URL et clés d'authentification
- Google Maps API Key et Map ID

### 4. Vérification de la connexion à la base de données

Le projet utilise Supabase comme backend. La base de données est déjà configurée avec :

#### Tables existantes :
- `profiles` - Profils utilisateurs
- `friendships` - Relations d'amitié
- `dates` - Entrées de dates
- `wingman_actions` - Actions des wingmen

#### Migrations :
Toutes les migrations SQL sont dans `supabase/migrations/` et ont déjà été appliquées.

### 5. Lancer le projet

```bash
npm run dev
```

Le projet sera accessible sur `http://localhost:5173`

## Structure du projet

```
src/
├── components/
│   ├── ui/              # Composants UI de base (Button, Input, Badge, etc.)
│   ├── layout/          # Layout (TopBar, BottomNav, PageWrapper)
│   ├── map/             # Composants carte (MapPin, ClusterPin, DatePreviewCard)
│   ├── date/            # Composants dates (DateCard)
│   ├── wingman/         # Composants wingman (WingmanPanel, AdviceFeed)
│   └── profile/         # Composants profil
├── pages/               # Pages de l'application
│   ├── AuthPage.tsx     # Authentification
│   ├── HomePage.tsx     # Carte avec pins
│   ├── NewDatePage.tsx  # Formulaire de création de date
│   ├── DateDetailPage.tsx
│   └── ProfilePage.tsx
├── stores/              # State management (Zustand)
│   ├── authStore.ts
│   ├── datesStore.ts
│   ├── friendsStore.ts
│   └── wingmanStore.ts
├── types/               # Types TypeScript
├── utils/               # Utilitaires (vibeColors, mapStyles)
└── lib/                 # Configuration (supabase.ts)
```

## Fonctionnalités implémentées

### Authentification
- Email/password
- Google OAuth
- Gestion de session avec Supabase

### Page d'accueil (Carte)
- Affichage des dates sur Google Maps
- Pins avec couleurs selon le "vibe" du date
- Système de clustering intelligent
- Preview cards au clic sur un pin
- Badges avatar pour identifier les amis

### Création de dates
- Formulaire en 3 étapes
- Sélection du vibe (romantique, casual, premier date, fun/festif, cosy, autre)
- Informations lieu et mood tags
- Brief pour les wingmen
- Notation du vibe après le date

### Profil
- Liste des dates
- Gestion des amis
- Suppression de compte

## Système de "Vibes"

Chaque date a un "vibe" qui définit sa couleur sur la carte :
- **Romantique** - Rose (#d4486a)
- **Casual** - Doré (#b8872a)
- **Premier date** - Violet (#a855f7)
- **Fun/Festif** - Orange (#f97316)
- **Cosy** - Cyan (#22d3ee)
- **Autre** - Transparent

Les pins sur la carte :
- Affichent un glow radial avec la couleur du vibe
- Ont une animation breathing pour les dates futures
- Sont semi-transparents (30%) pour les dates passées
- Affichent l'initiale de l'ami dans un badge

## Commandes utiles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Vérification des types TypeScript
npm run typecheck

# Preview du build
npm run preview
```

## Accès à la base de données

Dans Bolt, tu as accès aux outils MCP Supabase :
- `list_tables` - Liste toutes les tables
- `execute_sql` - Exécute des requêtes SQL
- `apply_migration` - Applique une nouvelle migration

## Design System

### Couleurs
- **ink** (#0e0c0a) - Fond principal
- **cream** (#f8f3ec) - Texte clair
- **pink** (#d4486a) - Actions principales
- **gold** (#b8872a) - Accents

### Typographie
- **Playfair Display** (italic) - Titres
- **Cormorant Garamond** - Corps de texte
- **DM Mono** - Labels et boutons

### Composants
- Boutons en forme de pilule
- Cards semi-transparentes avec backdrop blur
- Animations subtiles (breathing, hover)

## Problèmes courants

### Le serveur de dev ne démarre pas
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erreurs TypeScript
```bash
npm run typecheck
```

### Problème de connexion Supabase
Vérifie que le fichier `.env` contient bien les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.

## Notes importantes

- Le projet est optimisé pour mobile (390px de large)
- PWA activé (fonctionne offline)
- Toutes les données viennent de Supabase (pas de données mockées)
- RLS activé sur toutes les tables pour la sécurité

## Support

Si tu rencontres des problèmes, vérifie :
1. Les variables d'environnement sont correctes
2. Les dépendances sont installées
3. Le build passe sans erreur (`npm run build`)
