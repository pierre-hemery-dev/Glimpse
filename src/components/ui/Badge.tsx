import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'pink' | 'gold';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-txt-08 text-txt-100',
    pink: 'bg-pink-ghost text-pink border border-pink/30',
    gold: 'bg-gold-dim text-gold border border-gold/30',
  };

  return (
    <span
      className={`inline-flex items-center px-8 py-4 rounded-full text-xs font-mono uppercase tracking-wider ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
