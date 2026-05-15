/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#EEF2F8',
          100: '#D9E1ED',
          200: '#B3C3DB',
          300: '#8DA5C9',
          400: '#5A78A8',
          500: '#2F4D80',
          600: '#1E3A6B',
          700: '#152F58',
          800: '#122E55',
          900: '#0B1F3A',
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
        'subtle': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'card':   '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
}