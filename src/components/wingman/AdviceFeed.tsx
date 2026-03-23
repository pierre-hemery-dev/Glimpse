import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import type { WingmanAction } from '@/types';

interface AdviceFeedProps {
  actions: Array<WingmanAction & { profiles?: { username: string; avatar_url?: string } }>;
}

export function AdviceFeed({ actions }: AdviceFeedProps) {
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'venue_suggestion':
        return '📍';
      case 'validation':
        return '✓';
      case 'advice':
        return '💡';
      default:
        return '💬';
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'venue_suggestion':
        return 'Suggestion de lieu';
      case 'validation':
        return 'Validation';
      case 'advice':
        return 'Conseil';
      default:
        return 'Action';
    }
  };

  if (actions.length === 0) {
    return (
      <div className="text-center py-48">
        <p className="text-txt-60 italic">Aucun conseil pour le moment</p>
        <p className="text-txt-38 text-sm mt-8">Soyez le premier à aider votre ami</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {actions.map((action) => (
        <div key={action.id} className="flex gap-12">
          <Avatar
            src={action.profiles?.avatar_url}
            name={action.profiles?.username || 'Unknown'}
            size="sm"
          />
          <div className="flex-1">
            <div className="flex items-center gap-8 mb-4">
              <span className="text-sm text-txt-100 font-medium">
                {action.profiles?.username}
              </span>
              <Badge variant="default" className="text-xs">
                {getActionIcon(action.type)} {getActionLabel(action.type)}
              </Badge>
            </div>

            {action.venue_name && (
              <div className="mb-8 p-12 bg-gold-dim border border-gold/30 rounded-lg">
                <p className="text-sm text-gold font-medium">{action.venue_name}</p>
                {action.venue_address && (
                  <p className="text-xs text-txt-60 mt-4">{action.venue_address}</p>
                )}
              </div>
            )}

            {action.content && (
              <p className="text-sm text-txt-100 bg-txt-08 p-12 rounded-lg">{action.content}</p>
            )}

            <p className="text-xs text-txt-38 mt-4">
              {new Date(action.created_at).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
