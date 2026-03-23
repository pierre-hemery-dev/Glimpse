import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const signInSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
});

const signUpSchema = signInSchema.extend({
  username: z
    .string()
    .min(3, 'Minimum 3 caractères')
    .max(20, 'Maximum 20 caractères')
    .regex(/^[a-zA-Z0-9_]+$/, 'Seulement lettres, chiffres et underscore'),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, signInWithGoogle, loading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpForm>({
    resolver: zodResolver(mode === 'signin' ? signInSchema : signUpSchema),
  });

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
    reset();
  };

  const onSubmit = async (data: SignUpForm) => {
    setError(null);
    try {
      if (mode === 'signin') {
        await signIn(data.email, data.password);
      } else {
        await signUp(data.email, data.password, data.username);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-48">
          <h1 className="text-6xl mb-16 text-txt-100">
            Glimpse
          </h1>
          <p className="text-txt-60 italic">
            Let your people pick your person
          </p>
        </div>

        <div className="card p-32">
          <h2 className="font-mono uppercase tracking-wider text-sm text-txt-60 mb-24">
            {mode === 'signin' ? 'Connexion' : 'Inscription'}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-24">
            {mode === 'signup' && (
              <Input
                label="Nom d'utilisateur"
                placeholder="username"
                {...register('username')}
                error={errors.username?.message}
              />
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />

            {error && (
              <div className="p-12 rounded-md bg-pink-ghost border border-pink/30">
                <p className="text-sm text-pink">{error}</p>
              </div>
            )}

            <Button type="submit" fullWidth loading={loading}>
              {mode === 'signin' ? 'Se connecter' : "S'inscrire"}
            </Button>
          </form>

          <div className="relative my-24">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-txt-08"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-8 bg-ink-soft text-txt-38 font-mono uppercase tracking-wider">
                Ou
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            fullWidth
            onClick={handleGoogleSignIn}
            loading={loading}
          >
            Continuer avec Google
          </Button>

          <div className="mt-24 text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-txt-60 hover:text-txt-100 transition-colors"
            >
              {mode === 'signin' ? (
                <>
                  Pas encore de compte ?{' '}
                  <span className="text-pink">S'inscrire</span>
                </>
              ) : (
                <>
                  Déjà inscrit ?{' '}
                  <span className="text-pink">Se connecter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
