/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
          '100': 'var(--ink-100)',
          '55': 'var(--ink-55)',
          '35': 'var(--ink-35)',
          '12': 'var(--ink-12)',
        },
        cream: 'var(--cream)',
        pink: {
          DEFAULT: 'var(--pink)',
          dim: 'var(--pink-dim)',
          ghost: 'var(--pink-ghost)',
        },
        gold: {
          DEFAULT: 'var(--gold)',
          dim: 'var(--gold-dim)',
        },
        txt: {
          '100': 'var(--txt-100)',
          '60': 'var(--txt-60)',
          '38': 'var(--txt-38)',
          '18': 'var(--txt-18)',
          '08': 'var(--txt-08)',
        }
      },
      spacing: {
        '4': 'var(--sp-4)',
        '8': 'var(--sp-8)',
        '12': 'var(--sp-12)',
        '16': 'var(--sp-16)',
        '24': 'var(--sp-24)',
        '32': 'var(--sp-32)',
        '48': 'var(--sp-48)',
      },
      borderRadius: {
        'sm': 'var(--r-sm)',
        'md': 'var(--r-md)',
        'lg': 'var(--r-lg)',
        'xl': 'var(--r-xl)',
        'full': 'var(--r-full)',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Cormorant Garamond', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
      transitionDuration: {
        'fast': 'var(--t-fast)',
        'base': 'var(--t-base)',
        'slow': 'var(--t-slow)',
      }
    },
  },
  plugins: [],
}
