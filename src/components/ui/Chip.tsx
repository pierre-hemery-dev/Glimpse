import { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ children, selected = false, onClick, className = '' }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-16 py-8 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
        selected
          ? 'bg-pink text-cream'
          : 'bg-txt-08 text-txt-60 hover:bg-txt-18'
      } ${className}`}
    >
      {children}
    </button>
  );
}
