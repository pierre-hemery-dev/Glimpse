import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { DateEntry } from '@/types';

interface DatePreviewCardProps {
  date: DateEntry;
  onClose: () => void;
}

export function DatePreviewCard({ date, onClose }: DatePreviewCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const isWithin24Hours = () => {
    const dateTime = new Date(date.calendar_date).getTime();
    const now = Date.now();
    const diff = dateTime - now;
    return diff > 0 && diff < 24 * 60 * 60 * 1000;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-16 bg-ink/60 backdrop-blur-sm" onClick={onClose}>
      <Card
        className="w-full max-w-md p-24 animate-slide-up bg-ink-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-16 mb-16">
          <Avatar
            src={date.profiles?.avatar_url}
            name={date.profiles?.username || 'Unknown'}
            size="md"
          />
          <div className="flex-1">
            <h3 className="text-lg font-body text-txt-100">
              {date.profiles?.username} a un date
            </h3>
            <p className="text-sm text-txt-60">{formatDate(date.calendar_date)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-4 hover:bg-txt-08 rounded-full transition-colors"
          >
            <svg className="w-14 h-14 text-txt-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-16 space-y-8">
          {date.venue_name && (
            <p className="text-txt-100">
              <span className="text-txt-60">Lieu: </span>
              {date.venue_name}
            </p>
          )}
          <p className="text-txt-100">
            <span className="text-txt-60">Avec: </span>
            {date.pseudo}
          </p>
          {date.mood_tags && date.mood_tags.length > 0 && (
            <div className="flex gap-8 flex-wrap">
              {date.mood_tags.map((tag) => (
                <Badge key={tag} variant="pink">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {isWithin24Hours() && (
          <div className="mb-16 p-12 bg-pink-ghost border border-pink/30 rounded-lg">
            <p className="text-xs text-pink font-mono uppercase tracking-wider">
              Date dans moins de 24h
            </p>
          </div>
        )}

        <button
          onClick={() => navigate(`/date/${date.id}`)}
          className="btn-primary w-full"
        >
          Aider {date.profiles?.username} →
        </button>
      </Card>
    </div>
  );
}
