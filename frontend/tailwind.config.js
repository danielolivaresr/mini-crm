/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Acento de marca (violeta)
        accent: {
          50:  '#F1EFFE',
          100: '#E3DFFD',
          200: '#C7BFFC',
          300: '#A99CF9',
          400: '#8A79F7',
          500: '#7A6BF6',
          600: '#6D5FF5',   // ← color principal de la marca
          700: '#5B4FD4',
          800: '#4940A8',
          900: '#3A3382',
        },
        // Mantenemos navy por si quieres usarla en algún sitio puntual
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
        // Tokens semánticos del tema oscuro
        surface: {
          base: '#0F0F13',   // fondo principal de la app
          card: '#18181F',   // tarjetas y superficies elevadas
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
        // Sombras adaptadas a fondo oscuro
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'card':   '0 4px 12px -2px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}