import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { DateEntry } from '@/types';

interface DateCardProps {
  date: DateEntry;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function DateCard({ date, onEdit, onDelete }: DateCardProps) {
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const today = new Date();
    const isPast = d < today;

    return {
      formatted: d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      isPast,
    };
  };

  const { formatted, isPast } = formatDate(date.calendar_date);

  const getVibeEmoji = (vibe?: string) => {
    switch (vibe) {
      case 'desastre':
        return '😱';
      case 'pas_ouf':
        return '😕';
      case 'bof':
        return '😐';
      case 'bien':
        return '😊';
      case 'incroyable':
        return '🤩';
      default:
        return '';
    }
  };

  return (
    <Card className="p-24">
      <div className="flex items-start justify-between mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-8 mb-4">
            <h3 className="text-lg font-body text-txt-100">{date.pseudo}</h3>
            {date.vibe_rating && (
              <span className="text-xl">{getVibeEmoji(date.vibe_rating)}</span>
            )}
          </div>
          <p className={`text-sm ${isPast ? 'text-txt-38' : 'text-pink'}`}>
            {formatted}
          </p>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-8">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-8 hover:bg-txt-08 rounded-full transition-colors"
                aria-label="Modifier"
              >
                <svg className="w-16 h-16 text-txt-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-8 hover:bg-pink-ghost rounded-full transition-colors"
                aria-label="Supprimer"
              >
                <svg className="w-16 h-16 text-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {date.venue_name && (
        <p className="text-sm text-txt-100 mb-8">
          <span className="text-txt-60">Lieu: </span>
          {date.venue_name}
        </p>
      )}

      {date.venue_type && (
        <div className="mb-8">
          <Badge variant="default">{date.venue_type.replace('_', ' ')}</Badge>
        </div>
      )}

      {date.mood_tags && date.mood_tags.length > 0 && (
        <div className="flex gap-8 flex-wrap mb-12">
          {date.mood_tags.map((tag) => (
            <Badge key={tag} variant="pink">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {date.description && (
        <p className="text-sm text-txt-60 italic line-clamp-2">{date.description}</p>
      )}

      <div className="mt-12 pt-12 border-t border-txt-08 flex items-center justify-between">
        <Badge variant={date.visibility === 'friends' ? 'default' : 'gold'}>
          {date.visibility === 'friends' ? '👥 Visible amis' : '🔒 Privé'}
        </Badge>
      </div>
    </Card>
  );
}
