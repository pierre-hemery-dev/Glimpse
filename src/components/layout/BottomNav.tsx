import { useNavigate, useLocation } from 'react-router-dom';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ink-soft backdrop-blur-md border-t border-txt-08">
      <div className="max-w-screen-xl mx-auto px-16 py-12 flex items-center justify-around">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-4 py-8 px-16 rounded-lg transition-colors ${
            isActive('/') ? 'text-pink' : 'text-txt-60 hover:text-txt-100'
          }`}
        >
          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <span className="text-xs font-mono uppercase tracking-wider">Map</span>
        </button>

        <button
          onClick={() => navigate('/new-date')}
          className={`flex flex-col items-center gap-4 py-8 px-16 rounded-lg transition-colors ${
            isActive('/new-date') || location.pathname.startsWith('/new-date') ? 'text-pink' : 'text-txt-60 hover:text-txt-100'
          }`}
        >
          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs font-mono uppercase tracking-wider">Nouveau</span>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center gap-4 py-8 px-16 rounded-lg transition-colors ${
            isActive('/profile') ? 'text-pink' : 'text-txt-60 hover:text-txt-100'
          }`}
        >
          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-xs font-mono uppercase tracking-wider">Profil</span>
        </button>
      </div>
    </div>
  );
}
