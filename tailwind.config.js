/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#07090d',
          900: '#0b0e13',
          800: '#11151c',
          700: '#171c25',
          600: '#1f2530',
          500: '#2a313e',
        },
        ember: {
          400: '#34d4a8',
          500: '#11c39a',
          600: '#0aa07e',
        },
        electric: {
          400: '#5fb7ff',
          500: '#2f96ff',
          600: '#1577e6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 10px 40px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
        glow: '0 0 0 1px rgba(95,183,255,0.25), 0 12px 40px -10px rgba(47,150,255,0.35)',
        ember: '0 0 0 1px rgba(52,212,168,0.25), 0 12px 40px -10px rgba(17,195,154,0.35)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(ellipse at top, rgba(47,150,255,0.10), transparent 60%), radial-gradient(ellipse at bottom right, rgba(17,195,154,0.08), transparent 50%)',
      },
      animation: {
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '1' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
