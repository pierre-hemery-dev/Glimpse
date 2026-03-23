import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { ProfileDateCard } from '@/components/profile/ProfileDateCard';
import { DeleteConfirmSheet } from '@/components/profile/DeleteConfirmSheet';
import { useAuthStore } from '@/stores/authStore';
import { useDatesStore } from '@/stores/datesStore';
import { useFriendsStore } from '@/stores/friendsStore';
import type { DateEntry } from '@/types';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, signOut, loading: authLoading } = useAuthStore();
  const { dates, deleteDate, loading: datesLoading } = useDatesStore();
  const { friends, fetchFriends, loading: friendsLoading } = useFriendsStore();
  const [deleteSheet, setDeleteSheet] = useState<{ isOpen: boolean; date: DateEntry | null }>({
    isOpen: false,
    date: null,
  });

  useEffect(() => {
    if (user) {
      fetchFriends(user.id);
    }
  }, [user, fetchFriends]);

  const now = new Date();
  const upcomingDates = dates
    .filter((d) => new Date(d.calendar_date) >= now)
    .sort((a, b) => new Date(a.calendar_date).getTime() - new Date(b.calendar_date).getTime());

  const pastDates = dates
    .filter((d) => new Date(d.calendar_date) < now)
    .sort((a, b) => new Date(b.calendar_date).getTime() - new Date(a.calendar_date).getTime());

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleDateClick = (date: DateEntry) => {
    navigate(`/new-date?edit=${date.id}`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteSheet.date) return;

    try {
      await deleteDate(deleteSheet.date.id);
      setDeleteSheet({ isOpen: false, date: null });
    } catch (error) {
      console.error('Error deleting date:', error);
    }
  };

  const handleDateLongPress = (date: DateEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteSheet({ isOpen: true, date });
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-12 py-24 pb-96">
        <div className="mb-40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-16 mb-24">
            <div className="flex items-center gap-12">
              <Avatar
                src={profile?.avatar_url}
                alt={profile?.username || 'User'}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-display text-txt-100 truncate">
                  {profile?.username || 'Utilisateur'}
                </h1>
                <p className="text-txt-60 text-sm truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              loading={authLoading}
              className="self-start sm:self-auto"
            >
              Se déconnecter
            </Button>
          </div>
        </div>

        <div className="space-y-40">
          <section>
            <h2 className="text-2xl font-display text-txt-100 mb-16">Mes dates</h2>

            {datesLoading ? (
              <div className="py-32 text-center text-txt-60">Chargement...</div>
            ) : dates.length === 0 ? (
              <div className="py-48 text-center">
                <p className="text-txt-60 mb-16">Aucun date pour le moment</p>
                <Button onClick={() => navigate('/new-date')}>Créer mon premier date</Button>
              </div>
            ) : (
              <div className="space-y-32">
                {upcomingDates.length > 0 && (
                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-wider text-txt-60 mb-12">
                      À venir ({upcomingDates.length})
                    </h3>
                    <div className="space-y-8">
                      {upcomingDates.map((date) => (
                        <div
                          key={date.id}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            handleDateLongPress(date, e);
                          }}
                        >
                          <ProfileDateCard
                            date={date}
                            onClick={() => handleDateClick(date)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pastDates.length > 0 && (
                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-wider text-txt-60 mb-12">
                      Passés ({pastDates.length})
                    </h3>
                    <div className="space-y-8">
                      {pastDates.map((date) => (
                        <div
                          key={date.id}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            handleDateLongPress(date, e);
                          }}
                        >
                          <ProfileDateCard
                            date={date}
                            onClick={() => handleDateClick(date)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-display text-txt-100 mb-16">Mes wingmen</h2>

            {friendsLoading ? (
              <div className="py-32 text-center text-txt-60">Chargement...</div>
            ) : friends.length === 0 ? (
              <div className="py-32 text-center">
                <p className="text-txt-60">Aucun ami pour le moment</p>
              </div>
            ) : (
              <div className="space-y-8">
                {friends.map((friendship) => (
                  <div
                    key={friendship.id}
                    className="flex items-center gap-12 p-16 bg-white border border-txt-16 rounded-xl"
                  >
                    <Avatar
                      src={friendship.friend_profile.avatar_url}
                      alt={friendship.friend_profile.username}
                      size="sm"
                    />
                    <span className="text-txt-100 font-medium">
                      {friendship.friend_profile.username}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <DeleteConfirmSheet
        isOpen={deleteSheet.isOpen}
        onClose={() => setDeleteSheet({ isOpen: false, date: null })}
        onConfirm={handleDeleteConfirm}
        loading={datesLoading}
        datePseudo={deleteSheet.date?.pseudo || ''}
      />
    </PageWrapper>
  );
}
