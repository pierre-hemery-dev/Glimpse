import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useWingmanStore } from '@/stores/wingmanStore';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import type { WingmanActionType } from '@/types';

interface WingmanPanelProps {
  dateId: string;
  onActionAdded: () => void;
}

export function WingmanPanel({ dateId, onActionAdded }: WingmanPanelProps) {
  const [mode, setMode] = useState<WingmanActionType | null>(null);
  const [content, setContent] = useState('');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const { addAction, loading } = useWingmanStore();

  const places = useMapsLibrary('places');
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!places || !inputRef.current || mode !== 'venue_suggestion') return;

    const options: google.maps.places.AutocompleteOptions = {
      fields: ['name', 'formatted_address'],
      types: ['establishment'],
    };

    autocompleteRef.current = new places.Autocomplete(inputRef.current, options);

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place) {
        setVenueName(place.name || '');
        setVenueAddress(place.formatted_address || '');
      }
    });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [places, mode]);

  const handleSubmit = async () => {
    if (!mode) return;

    try {
      await addAction({
        date_id: dateId,
        type: mode,
        content: content || undefined,
        venue_name: venueName || undefined,
        venue_address: venueAddress || undefined,
      });

      setMode(null);
      setContent('');
      setVenueName('');
      setVenueAddress('');
      onActionAdded();
    } catch (error) {
      console.error('Error adding action:', error);
    }
  };

  if (mode === 'venue_suggestion') {
    return (
      <div className="card p-24 space-y-16">
        <h3 className="font-mono uppercase tracking-wider text-sm text-txt-60">
          Suggérer un lieu
        </h3>

        <div>
          <label className="block font-mono text-xs uppercase tracking-wider text-txt-60 mb-8">
            Rechercher un lieu
          </label>
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher un restaurant, café, bar..."
            className="w-full px-16 py-12 bg-txt-08 border border-txt-16 rounded-lg text-txt-100 placeholder:text-txt-38 focus:outline-none focus:border-pink transition-colors"
          />
        </div>

        {venueName && (
          <>
            <Input
              label="Nom du lieu"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
            />

            <Input
              label="Adresse"
              value={venueAddress}
              onChange={(e) => setVenueAddress(e.target.value)}
            />
          </>
        )}

        <div className="flex gap-8">
          <Button variant="outline" onClick={() => setMode(null)} fullWidth>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            fullWidth
            loading={loading}
            disabled={!venueName}
          >
            Envoyer
          </Button>
        </div>
      </div>
    );
  }

  if (mode === 'advice') {
    return (
      <div className="card p-24 space-y-16">
        <h3 className="font-mono uppercase tracking-wider text-sm text-txt-60">
          Envoyer un conseil
        </h3>

        <div>
          <label className="block font-mono text-xs uppercase tracking-wider text-txt-60 mb-8">
            Votre conseil
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Sois toi-même, tu vas assurer 💪"
            rows={4}
            className="w-full"
          />
        </div>

        <div className="flex gap-8">
          <Button variant="outline" onClick={() => setMode(null)} fullWidth>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            fullWidth
            loading={loading}
            disabled={!content.trim()}
          >
            Envoyer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-24">
      <h3 className="font-mono uppercase tracking-wider text-sm text-txt-60 mb-16">
        Actions wingman
      </h3>

      <div className="space-y-8">
        <Button onClick={() => setMode('venue_suggestion')} fullWidth>
          📍 Suggérer un lieu
        </Button>

        <Button
          variant="outline"
          onClick={async () => {
            try {
              await addAction({
                date_id: dateId,
                type: 'validation',
                content: 'Validé !',
              });
              onActionAdded();
            } catch (error) {
              console.error('Error validating:', error);
            }
          }}
          fullWidth
          loading={loading}
        >
          ✓ Valider
        </Button>

        <Button variant="ghost" onClick={() => setMode('advice')} fullWidth>
          💡 Envoyer un conseil
        </Button>
      </div>
    </div>
  );
}
