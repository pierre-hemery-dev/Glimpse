import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const variantClass = {
    primary: 'btn-primary relative overflow-hidden',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
  }[variant];

  return (
    <button
      className={`${variantClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {variant === 'primary' && !loading && (
        <span className="absolute inset-0 animate-shimmer"></span>
      )}
      <span className="relative z-10">
        {loading ? 'Loading...' : children}
      </span>
    </button>
  );
}
