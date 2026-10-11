const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // Los colores salen de las variables CSS definidas en src/index.css
      colors: {
        canvas: token('canvas'),
        overlay: token('overlay'),
        surface: {
          DEFAULT: token('surface'),
          hover:   token('surface-hover'),
          active:  token('surface-active'),
        },
        line: {
          DEFAULT: token('line'),
          strong:  token('line-strong'),
        },
        ink: {
          DEFAULT: token('ink'),
          soft:    token('ink-soft'),
          muted:   token('ink-muted'),
          faint:   token('ink-faint'),
        },
        primary: {
          DEFAULT: token('primary'),
          hover:   token('primary-hover'),
          strong:  token('primary-strong'),
          soft:    token('primary-soft'),
          line:    token('primary-line'),
          fg:      token('primary-fg'),
        },
        danger: {
          DEFAULT: token('danger'),
          strong:  token('danger-strong'),
          soft:    token('danger-soft'),
          line:    token('danger-line'),
        },
        success: {
          DEFAULT: token('success'),
          strong:  token('success-strong'),
          soft:    token('success-soft'),
          line:    token('success-line'),
        },
        warning: {
          strong:  token('warning-strong'),
          soft:    token('warning-soft'),
          line:    token('warning-line'),
        },
        info: {
          strong:  token('info-strong'),
          soft:    token('info-soft'),
          line:    token('info-line'),
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs':  ['0.75rem',  { lineHeight: '1rem' }],
        'sm':  ['0.875rem', { lineHeight: '1.25rem' }],
        'base':['0.9375rem',{ lineHeight: '1.5rem' }],
        'lg':  ['1.0625rem',{ lineHeight: '1.625rem' }],
        'xl':  ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem',   { lineHeight: '2rem' }],
      },
      borderRadius: {
        DEFAULT: '6px',
      },
      boxShadow: {
        // Cada tema define las suyas en src/index.css
        'subtle': 'var(--shadow-subtle)',
        'card':   'var(--shadow-card)',
      },
    },
  },
  plugins: [],
}