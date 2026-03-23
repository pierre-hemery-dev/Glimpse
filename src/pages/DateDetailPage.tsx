import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { WingmanPanel } from '@/components/wingman/WingmanPanel';
import { AdviceFeed } from '@/components/wingman/AdviceFeed';
import { useWingmanStore } from '@/stores/wingmanStore';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import type { DateEntry } from '@/types';

export function DateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { actions, fetchActions } = useWingmanStore();
  const { user } = useAuthStore();
  const [date, setDate] = useState<DateEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDate = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('dates')
          .select(`
            *,
            profiles:user_id (
              id,
              username,
              avatar_url
            )
          `)
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        setDate(data);
      } catch (error) {
        console.error('Error fetching date:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDate();
    fetchActions(id);
  }, [id, fetchActions]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`wingman_actions_${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wingman_actions',
          filter: `date_id=eq.${id}`,
        },
        () => {
          fetchActions(id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, fetchActions]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="p-24 text-center">
          <p className="text-txt-60">Chargement...</p>
        </div>
      </PageWrapper>
    );
  }

  if (!date) {
    return (
      <PageWrapper>
        <div className="p-24 text-center">
          <p className="text-txt-60">Date non trouvé</p>
          <button onClick={() => navigate('/')} className="text-pink mt-16">
            Retour à la carte
          </button>
        </div>
      </PageWrapper>
    );
  }

  const isDateOwner = user?.id === date.user_id;

  const profile = date.profiles as { username: string; avatar_url?: string } | undefined;

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) {
      return `Aujourd'hui à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (d.toDateString() === tomorrow.toDateString()) {
      return `Demain à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }

    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleActionAdded = () => {
    if (id) {
      fetchActions(id);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto p-16 space-y-24">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-8 text-txt-60 hover:text-txt-100 transition-colors"
        >
          <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>

        <Card className="p-24">
          <div className="flex items-center gap-16 mb-16">
            <Avatar
              src={profile?.avatar_url}
              name={profile?.username || 'Unknown'}
              size="lg"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-display text-txt-100">
                {profile?.username} a un date
              </h1>
              <p className="text-txt-60">{formatDate(date.calendar_date)}</p>
            </div>
          </div>

          <div className="space-y-12 mb-16">
            <div>
              <span className="text-txt-60 text-sm">Avec: </span>
              <span className="text-txt-100">{date.pseudo}</span>
            </div>

            {date.venue_name && (
              <div>
                <span className="text-txt-60 text-sm">Lieu: </span>
                <span className="text-txt-100">{date.venue_name}</span>
                {date.venue_address && (
                  <p className="text-txt-38 text-sm mt-4">{date.venue_address}</p>
                )}
              </div>
            )}

            {date.venue_type && (
              <div>
                <span className="text-txt-60 text-sm">Type: </span>
                <Badge variant="default">{date.venue_type.replace('_', ' ')}</Badge>
              </div>
            )}

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

          {date.description && (
            <div className="p-16 bg-txt-08 rounded-lg">
              <p className="text-sm text-txt-60 font-mono uppercase tracking-wider mb-8">
                Description
              </p>
              <p className="text-txt-100 italic">{date.description}</p>
            </div>
          )}
        </Card>

        {!isDateOwner && (
          <WingmanPanel dateId={date.id} onActionAdded={handleActionAdded} />
        )}

        <Card className="p-24">
          <h2 className="font-mono uppercase tracking-wider text-sm text-txt-60 mb-16">
            Conseils de la team
          </h2>
          <AdviceFeed actions={actions} />
        </Card>
      </div>
    </PageWrapper>
  );
}
