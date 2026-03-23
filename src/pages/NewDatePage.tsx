import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Chip } from '@/components/ui/Chip';
import { useDatesStore } from '@/stores/datesStore';
import { useAuthStore } from '@/stores/authStore';
import type { VenueType, VibeRating, Visibility } from '@/types';

const VENUE_TYPES: Array<{ value: VenueType; label: string }> = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Café' },
  { value: 'bar', label: 'Bar' },
  { value: 'cinema', label: 'Cinéma' },
  { value: 'chez_moi', label: 'Chez moi' },
  { value: 'chez_iel', label: 'Chez iel' },
  { value: 'exterieur', label: 'Extérieur' },
  { value: 'autre', label: 'Autre' },
];

const MOOD_TAGS = [
  'tranquille',
  'festif',
  'bruyant',
  'cosy',
  'romantique',
  'fun',
];

const VIBE_RATINGS: Array<{ value: VibeRating; emoji: string }> = [
  { value: 'desastre', emoji: '💀' },
  { value: 'pas_ouf', emoji: '😬' },
  { value: 'bof', emoji: '😐' },
  { value: 'bien', emoji: '😄' },
  { value: 'incroyable', emoji: '🔥' },
];

const dateFormSchema = z.object({
  calendar_date: z.string().min(1, 'Date requise'),
  pseudo: z.string().min(1, 'Pseudo requis'),
  venue_type: z.enum(['restaurant', 'cafe', 'bar', 'cinema', 'chez_moi', 'chez_iel', 'exterieur', 'autre']).optional(),
  venue_name: z.string().optional(),
  venue_address: z.string().optional(),
  venue_lat: z.number().optional(),
  venue_lng: z.number().optional(),
  mood_tags: z.array(z.string()).optional(),
  venue_rating: z.boolean().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  vibe_rating: z.enum(['desastre', 'pas_ouf', 'bof', 'bien', 'incroyable']).optional(),
});

type DateFormData = z.infer<typeof dateFormSchema>;

export function NewDatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { createDate, updateDate, loading, dates } = useDatesStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [moodTags, setMoodTags] = useState<string[]>([]);
  const [venueRating, setVenueRating] = useState<boolean | undefined>();
  const [vibeRating, setVibeRating] = useState<VibeRating | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [existingPseudos, setExistingPseudos] = useState<string[]>([]);
  const [showPseudoSuggestions, setShowPseudoSuggestions] = useState(false);

  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DateFormData>({
    resolver: zodResolver(dateFormSchema),
    defaultValues: {
      mood_tags: [],
    },
  });

  const calendarDate = watch('calendar_date');
  const pseudo = watch('pseudo');
  const venueType = watch('venue_type');
  const venueName = watch('venue_name');

  const isPastDate = calendarDate ? new Date(calendarDate) < new Date() : false;
  const canProceedStep1 = calendarDate && pseudo?.trim();

  const editingDate = editId ? dates.find(d => d.id === editId) : null;
  const isEditMode = !!editingDate;

  useEffect(() => {
    const uniquePseudos = Array.from(new Set(dates.map(d => d.pseudo)));
    setExistingPseudos(uniquePseudos);
  }, [dates]);

  useEffect(() => {
    if (editingDate) {
      const dateObj = new Date(editingDate.calendar_date);
      const localDatetime = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      reset({
        calendar_date: localDatetime,
        pseudo: editingDate.pseudo,
        venue_type: editingDate.venue_type,
        venue_name: editingDate.venue_name || '',
        venue_address: editingDate.venue_address || '',
        title: editingDate.title || '',
        description: editingDate.description || '',
      });

      setMoodTags(editingDate.mood_tags || []);
      setVenueRating(editingDate.venue_rating);
      setVibeRating(editingDate.vibe_rating);
    }
  }, [editingDate, reset]);

  const filteredPseudos = existingPseudos.filter(p =>
    p.toLowerCase().includes(pseudo?.toLowerCase() || '')
  );

  const toggleMoodTag = (tag: string) => {
    setMoodTags((prev) => {
      const updated = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];
      setValue('mood_tags', updated);
      return updated;
    });
  };

  const onSubmit = async (data: DateFormData, visibility?: Visibility) => {
    if (!user) return;

    setError(null);

    try {
      const dateData = {
        calendar_date: new Date(data.calendar_date).toISOString(),
        pseudo: data.pseudo,
        venue_type: data.venue_type,
        venue_name: data.venue_name,
        venue_address: data.venue_address,
        venue_lat: data.venue_lat,
        venue_lng: data.venue_lng,
        mood_tags: moodTags.length > 0 ? moodTags : undefined,
        venue_rating: venueRating,
        title: data.title,
        description: data.description,
        vibe_rating: vibeRating,
      };

      if (isEditMode && editingDate) {
        await updateDate(editingDate.id, dateData);
      } else {
        await createDate({
          ...dateData,
          user_id: user.id,
          visibility: visibility || 'friends',
        });
      }

      navigate('/profile');
    } catch (err) {
      setError(isEditMode ? 'Erreur lors de la modification du date' : 'Erreur lors de la création du date');
      console.error(err);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(isEditMode ? '/profile' : '/');
    }
  };

  const stepDirection = (currentStep: number) => {
    if (currentStep === step) return 'translate-x-0 opacity-100';
    if (currentStep < step) return '-translate-x-full opacity-0 absolute inset-0';
    return 'translate-x-full opacity-0 absolute inset-0';
  };

  return (
    <PageWrapper showBottomNav={false}>
      <div className="max-w-2xl mx-auto px-16 py-24 min-h-screen flex flex-col">
        <button
          onClick={handleBack}
          className="flex items-center gap-8 text-txt-60 hover:text-txt-100 transition-colors mb-24"
        >
          <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {step > 1 ? 'Retour' : 'Annuler'}
        </button>

        <div className="flex justify-center gap-8 mb-32">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-8 rounded-full transition-all duration-300 ${
                s === step ? 'w-32 bg-pink' : 'w-8 bg-txt-08'
              }`}
            />
          ))}
        </div>

        <div className="flex-1 relative">
          <div
            className={`transition-all duration-300 ease-in-out ${stepDirection(1)}`}
          >
            <div className="space-y-32">
              <div>
                <h1 className="text-4xl font-display text-txt-100 mb-12">
                  {isEditMode ? 'Modifier le date' : 'Nouveau date'}
                </h1>
                <p className="text-txt-60">Les infos essentielles</p>
              </div>

              <div className="space-y-24">
                <Input
                  label="Date et heure"
                  type="datetime-local"
                  {...register('calendar_date')}
                  error={errors.calendar_date?.message}
                />

                <div className="relative">
                  <Input
                    label="Pseudo"
                    placeholder="Le prénom de ton date..."
                    {...register('pseudo')}
                    error={errors.pseudo?.message}
                    onFocus={() => setShowPseudoSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowPseudoSuggestions(false), 200)}
                  />
                  {showPseudoSuggestions && filteredPseudos.length > 0 && pseudo && (
                    <div className="absolute z-10 w-full mt-4 bg-white border border-txt-16 rounded-xl shadow-lg overflow-hidden">
                      {filteredPseudos.slice(0, 5).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setValue('pseudo', p);
                            setShowPseudoSuggestions(false);
                          }}
                          className="w-full px-16 py-12 text-left hover:bg-pink-ghost transition-colors"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-16 bg-pink-ghost border border-pink/30 rounded-xl">
                  <p className="text-sm text-pink">{error}</p>
                </div>
              )}

              <Button
                onClick={() => setStep(2)}
                fullWidth
                disabled={!canProceedStep1}
              >
                Continuer →
              </Button>
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${stepDirection(2)}`}
          >
            <div className="space-y-32">
              <div>
                <h2 className="text-4xl font-display text-txt-100 mb-12">Le lieu</h2>
                <p className="text-txt-60">Optionnel, mais ça aide tes wingmen</p>
              </div>

              <div className="space-y-24">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-txt-60 mb-12">
                    Type de lieu
                  </label>
                  <div className="flex gap-8 overflow-x-auto pb-8 -mx-16 px-16">
                    {VENUE_TYPES.map((type) => (
                      <Chip
                        key={type.value}
                        selected={venueType === type.value}
                        onClick={() => setValue('venue_type', type.value)}
                      >
                        {type.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                <Input
                  label="Nom du lieu"
                  placeholder="Rechercher ou saisir un lieu..."
                  {...register('venue_name')}
                />

                <Input
                  label="Adresse (optionnel)"
                  placeholder="Pour le retrouver facilement"
                  {...register('venue_address')}
                />

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-txt-60 mb-12">
                    Mood recherché
                  </label>
                  <div className="flex flex-wrap gap-8">
                    {MOOD_TAGS.map((tag) => (
                      <Chip
                        key={tag}
                        selected={moodTags.includes(tag)}
                        onClick={() => toggleMoodTag(tag)}
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                </div>

                {venueName && (
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-txt-60 mb-12">
                      Recommandation
                    </label>
                    <div className="flex gap-8">
                      <button
                        type="button"
                        onClick={() => setVenueRating(true)}
                        className={`flex-1 px-16 py-12 rounded-full font-medium transition-all ${
                          venueRating === true
                            ? 'bg-pink text-white'
                            : 'bg-txt-04 text-txt-60 hover:bg-txt-08'
                        }`}
                      >
                        Je recommande 👍
                      </button>
                      <button
                        type="button"
                        onClick={() => setVenueRating(false)}
                        className={`flex-1 px-16 py-12 rounded-full font-medium transition-all ${
                          venueRating === false
                            ? 'bg-pink text-white'
                            : 'bg-txt-04 text-txt-60 hover:bg-txt-08'
                        }`}
                      >
                        Je ne recommande pas 👎
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={() => setStep(3)} fullWidth>
                Continuer →
              </Button>
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${stepDirection(3)}`}
          >
            <div className="space-y-32">
              <div>
                <h2 className="text-4xl font-display text-txt-100 mb-12">
                  Brief pour la crew
                </h2>
                <p className="text-txt-60">Raconte-leur ton plan</p>
              </div>

              <div className="space-y-24">
                <Input
                  label="Titre (optionnel)"
                  placeholder="Un titre accrocheur..."
                  {...register('title')}
                />

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-txt-60 mb-8">
                    Raconte !!
                  </label>
                  <textarea
                    {...register('description')}
                    placeholder="Décris l'ambiance que tu vises, ce que tu attends de ce date, ou ce qui s'est passé..."
                    rows={6}
                    className="w-full px-16 py-12 bg-white border border-txt-16 rounded-xl text-txt-100 placeholder:text-txt-40 placeholder:italic placeholder:font-serif focus:outline-none focus:ring-2 focus:ring-pink/20 focus:border-pink transition-all resize-none"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  />
                </div>

                {isPastDate && (
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-txt-60 mb-12">
                      Le vibe c'était comment ?
                    </label>
                    <div className="flex gap-12 justify-between">
                      {VIBE_RATINGS.map((rating) => (
                        <button
                          key={rating.value}
                          type="button"
                          onClick={() => setVibeRating(rating.value)}
                          className={`flex-1 aspect-square rounded-xl flex items-center justify-center text-4xl transition-all ${
                            vibeRating === rating.value
                              ? 'bg-pink scale-110'
                              : 'bg-txt-04 hover:bg-txt-08 hover:scale-105'
                          }`}
                        >
                          {rating.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-16 bg-pink-ghost border border-pink/30 rounded-xl">
                  <p className="text-sm text-pink">{error}</p>
                </div>
              )}

              <div className="space-y-12">
                {isEditMode ? (
                  <Button
                    onClick={handleFormSubmit((data) => onSubmit(data))}
                    fullWidth
                    loading={loading}
                    disabled={!canProceedStep1}
                  >
                    Enregistrer les modifications
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleFormSubmit((data) => onSubmit(data, 'friends'))}
                      fullWidth
                      loading={loading}
                      disabled={!canProceedStep1}
                    >
                      Appeler mes wingmen →
                    </Button>
                    <button
                      type="button"
                      onClick={handleFormSubmit((data) => onSubmit(data, 'private'))}
                      disabled={loading || !canProceedStep1}
                      className="w-full px-24 py-12 text-txt-60 hover:text-txt-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Garder pour moi
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
