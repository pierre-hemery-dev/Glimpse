interface MapPinProps {
  color?: 'pink' | 'gold';
  pulsing?: boolean;
  onClick?: () => void;
}

export function MapPin({ color = 'pink', pulsing = false, onClick }: MapPinProps) {
  const colors = {
    pink: 'bg-pink shadow-pink/50',
    gold: 'bg-gold shadow-gold/50',
  };

  return (
    <button
      onClick={onClick}
      className="relative group cursor-pointer"
      aria-label="Date marker"
    >
      <span
        className={`absolute inset-0 ${colors[color]} rounded-full animate-breathe blur-md`}
        style={{ width: '32px', height: '32px' }}
      ></span>
      {pulsing && (
        <span className={`absolute inset-0 ${colors[color]} rounded-full animate-ping opacity-75`}></span>
      )}
      <div className={`relative w-32 h-32 ${colors[color]} rounded-full shadow-lg transition-transform group-hover:scale-110`}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-0 h-0 border-l-8 border-r-8 border-t-12 border-transparent"
             style={{ borderTopColor: color === 'pink' ? '#d4486a' : '#b8872a' }}>
        </div>
      </div>
    </button>
  );
}
