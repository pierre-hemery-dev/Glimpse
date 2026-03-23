interface AvatarProps {
  src?: string | null;
  name?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ src, name, alt, size = 'md', className = '' }: AvatarProps) {
  const sizes = {
    sm: 'w-32 h-32 text-xs',
    md: 'w-48 h-48 text-sm',
    lg: 'w-64 h-64 text-base',
  };

  const displayName = name || alt || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={`${sizes[size]} rounded-full object-cover border border-txt-08 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-pink-ghost border border-pink/30 flex items-center justify-center font-mono text-pink ${className}`}
    >
      {initials}
    </div>
  );
}
