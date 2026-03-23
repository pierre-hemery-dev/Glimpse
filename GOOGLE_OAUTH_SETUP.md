# Configuration Google OAuth pour Glimpse

## Étape 1 : Vérifier Supabase

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet **dmmicgxjfazfuhlzzzix**
3. Menu gauche → **Authentication** → **Providers**
4. Trouvez **Google** dans la liste

### Ce que vous devez voir :

- **Enabled** : Le toggle doit être activé (vert)
- **Redirect URL** : Notez cette URL, elle devrait ressembler à :
  ```
  https://dmmicgxjfazfuhlzzzix.supabase.co/auth/v1/callback
  ```

## Étape 2 : Configurer Google Cloud Console

### A. Créer un projet Google Cloud (si pas déjà fait)

1. Allez sur [https://console.cloud.google.com](https://console.cloud.google.com)
2. Créez un nouveau projet ou sélectionnez-en un existant
3. Activez **Google+ API** (dans APIs & Services → Library)

### B. Créer des identifiants OAuth

1. Allez dans **APIs & Services** → **Credentials**
2. Cliquez sur **Create Credentials** → **OAuth client ID**
3. Type d'application : **Web application**
4. Nom : "Glimpse" (ou ce que vous voulez)

### C. Configurer les URLs autorisées

**JavaScript origins autorisées :**
```
http://localhost:5173
https://dmmicgxjfazfuhlzzzix.supabase.co
```

**URIs de redirection autorisées (IMPORTANT) :**
```
https://dmmicgxjfazfuhlzzzix.supabase.co/auth/v1/callback
```

5. Cliquez sur **Create**
6. **COPIEZ** le **Client ID** et le **Client Secret** générés

### D. Ajouter les credentials dans Supabase

1. Retournez dans **Supabase Dashboard** → **Authentication** → **Providers** → **Google**
2. Activez le toggle **Enabled**
3. Collez votre **Client ID** (de Google Cloud Console)
4. Collez votre **Client Secret** (de Google Cloud Console)
5. Cliquez sur **Save**

## Étape 3 : Tester

1. Relancez votre app (`npm run dev`)
2. Allez sur la page de connexion
3. Cliquez sur **Continuer avec Google**
4. Vous devriez voir la popup Google OAuth

## Erreurs courantes

### "n'autorise pas la connexion"
❌ La Redirect URL n'est pas configurée dans Google Cloud Console
✅ Ajoutez `https://dmmicgxjfazfuhlzzzix.supabase.co/auth/v1/callback`

### "redirect_uri_mismatch"
❌ L'URL ne correspond pas exactement
✅ Vérifiez qu'il n'y a pas d'espace ou de caractère supplémentaire

### "OAuth client not found"
❌ Le Client ID/Secret est incorrect
✅ Recopiez-les depuis Google Cloud Console

## URLs importantes

- **Supabase Dashboard** : https://app.supabase.com/project/dmmicgxjfazfuhlzzzix
- **Google Cloud Console** : https://console.cloud.google.com
- **Redirect URL Supabase** : https://dmmicgxjfazfuhlzzzix.supabase.co/auth/v1/callback
