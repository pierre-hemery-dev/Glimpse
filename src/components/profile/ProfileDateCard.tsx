import { format, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DateEntry } from '@/types';
import { Card } from '@/components/ui/Card';

const VIBE_EMOJIS: Record<string, string> = {
  desastre: '💀',
  pas_ouf: '😬',
  bof: '😐',
  bien: '😄',
  incroyable: '🔥',
};

interface ProfileDateCardProps {
  date: DateEntry;
  onClick: () => void;
}

export function ProfileDateCard({ date, onClick }: ProfileDateCardProps) {
  const isPastDate = isPast(new Date(date.calendar_date));

  return (
    <Card onClick={onClick} hover>
      <div className="flex items-start justify-between gap-16">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-8 mb-4">
            <h3 className="font-medium text-txt-100 text-lg">{date.pseudo}</h3>
            {date.vibe_rating && (
              <span className="text-2xl">{VIBE_EMOJIS[date.vibe_rating]}</span>
            )}
          </div>

          {date.venue_name && (
            <p className="text-txt-60 text-sm mb-8">{date.venue_name}</p>
          )}

          <div className="flex items-center gap-12 text-xs">
            <time className="text-txt-40">
              {format(new Date(date.calendar_date), "d MMM yyyy 'à' HH:mm", { locale: fr })}
            </time>
            {isPastDate && (
              <span className="px-8 py-2 bg-txt-08 text-txt-60 rounded-full">
                Passé
              </span>
            )}
          </div>
        </div>

        <svg
          className="w-20 h-20 text-txt-40 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Card>
  );
}
