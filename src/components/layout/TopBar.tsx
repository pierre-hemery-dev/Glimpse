import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  showNotifications?: boolean;
  onNotificationClick?: () => void;
}

export function TopBar({ showNotifications = false, onNotificationClick }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-ink/80 backdrop-blur-md border-b border-txt-08">
      <div className="max-w-screen-xl mx-auto px-16 py-16 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="font-display text-2xl italic text-txt-100"
        >
          Glimpse
        </button>

        {showNotifications && (
          <button
            onClick={onNotificationClick}
            className="p-8 rounded-full hover:bg-txt-08 transition-colors relative"
            aria-label="Notifications"
          >
            <svg
              className="w-24 h-24 text-txt-60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
