/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        moss:        '#2E4036',
        forest:      '#173D2C',
        clay:        '#CC5833',
        'clay-dark': '#A8431F',
        cream:       '#F2F0E9',
        surface:     '#FFFFFF',
        sage:        '#A9C5A9',
        charcoal:    '#1A1A1A',
        muted:       '#55615A',
        line:        '#DDE2D6',
      },
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        outfit:  ['Outfit', 'system-ui', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono:    ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '2xl':  '1rem',
        '3xl':  '1.5rem',
        '4xl':  '2rem',
        '5xl':  '2.5rem',
        '6xl':  '3rem',
        'hero': '4rem',
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight:   '-0.02em',
      },
      boxShadow: {
        'card':   '0 2px 24px 0 rgba(46,64,54,0.08)',
        'card-lg':'0 8px 48px 0 rgba(46,64,54,0.12)',
        'clay':   '0 4px 20px 0 rgba(204,88,51,0.25)',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.04)' },
        },
      },
    },
  },
  plugins: [],
};
