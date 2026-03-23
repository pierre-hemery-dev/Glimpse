import { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Avatar } from '@/components/ui/Avatar';
import { DatePreviewCard } from '@/components/map/DatePreviewCard';
import { MapPin } from '@/components/map/MapPin';
import { useDatesStore } from '@/stores/datesStore';
import { useAuthStore } from '@/stores/authStore';
import type { DateEntry } from '@/types';

const PARIS_CENTER = { lat: 48.8566, lng: 2.3522 };
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || '';

export function HomePage() {
  const { dates, friendDates, fetchUserDates, fetchFriendDates, loading } = useDatesStore();
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState<DateEntry | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserDates(user.id);
    }
    fetchFriendDates();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting user location:', error);
          setLocationLoading(false);
        }
      );
    } else {
      setLocationLoading(false);
    }
  }, [user, fetchUserDates, fetchFriendDates]);

  const isWithin24Hours = (dateString: string) => {
    const dateTime = new Date(dateString).getTime();
    const now = Date.now();
    const diff = dateTime - now;
    return diff > 0 && diff < 24 * 60 * 60 * 1000;
  };

  const allDates = [...dates, ...friendDates];

  const uniqueFriends = friendDates
    .filter((date) => date.profiles)
    .reduce((acc, date) => {
      const profile = date.profiles as { id: string; username: string; avatar_url?: string };
      if (!acc.find((p) => p.id === profile.id)) {
        acc.push(profile);
      }
      return acc;
    }, [] as Array<{ id: string; username: string; avatar_url?: string }>);

  if (loading || locationLoading) {
    return (
      <PageWrapper showNotifications topBarPadding={false}>
        <div className="relative flex-1 bg-ink-soft flex items-center justify-center">
          <div className="text-txt-60 font-mono">Chargement de la carte...</div>
        </div>
      </PageWrapper>
    );
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <PageWrapper showNotifications topBarPadding={false}>
        <div className="relative flex-1 bg-ink-soft flex items-center justify-center">
          <div className="text-center px-32 max-w-md">
            <div className="mb-24">
              <svg className="w-64 h-64 mx-auto text-txt-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h2 className="font-display text-2xl text-txt-100 mb-12">
              Carte indisponible
            </h2>
            <p className="text-txt-60 text-sm leading-relaxed mb-8">
              Pour afficher la carte des dates, vous devez configurer une clé API Google Maps.
            </p>
            <p className="text-txt-40 text-xs font-mono">
              VITE_GOOGLE_MAPS_API_KEY
            </p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper showNotifications topBarPadding={false}>
      <div className="absolute inset-0 bg-ink-soft">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
          <Map
            defaultCenter={userLocation || PARIS_CENTER}
            defaultZoom={13}
            disableDefaultUI
            gestureHandling="greedy"
            style={{ width: '100%', height: '100%' }}
            mapTypeId="roadmap"
            {...(GOOGLE_MAPS_MAP_ID && { mapId: GOOGLE_MAPS_MAP_ID })}
          >
            {allDates.map((date) => {
              if (!date.venue_lat || !date.venue_lng) return null;

              return (
                <AdvancedMarker
                  key={date.id}
                  position={{ lat: date.venue_lat, lng: date.venue_lng }}
                  onClick={() => setSelectedDate(date)}
                >
                  <MapPin
                    color={isWithin24Hours(date.calendar_date) ? 'pink' : 'gold'}
                    pulsing={isWithin24Hours(date.calendar_date)}
                  />
                </AdvancedMarker>
              );
            })}
          </Map>
        </APIProvider>

        {allDates.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="text-center px-32 bg-ink/80 backdrop-blur-sm rounded-16 py-32 pointer-events-auto">
              <h2 className="font-display text-3xl text-txt-100 mb-16">
                Aucun date prévu
              </h2>
              <p className="text-txt-60 italic">
                Ajoutez des amis pour voir leurs dates apparaître sur la carte
              </p>
            </div>
          </div>
        )}

        {uniqueFriends.length > 0 && (
          <div className="absolute bottom-[88px] left-0 right-0 bg-ink-soft/90 backdrop-blur-sm py-16 px-16 z-10">
            <div className="flex items-center justify-center gap-12 overflow-x-auto">
              {uniqueFriends.map((friend) => (
                <div key={friend.id} className="flex flex-col items-center gap-4">
                  <Avatar src={friend.avatar_url} name={friend.username} size="sm" />
                  <span className="text-xs text-txt-60">{friend.username}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedDate && (
        <DatePreviewCard
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </PageWrapper>
  );
}
