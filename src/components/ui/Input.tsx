import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block font-mono text-xs uppercase tracking-wider text-txt-60 mb-8">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-8 text-xs text-pink">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
