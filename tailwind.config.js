/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0A1622',
          800: '#0B1F3A',
          700: '#13283F',
          600: '#1B344F',
        },
        steel: { DEFAULT: '#6B7280', 400: '#5B7185' },
        gold: { DEFAULT: '#D4AF37', soft: '#E0C074' },
        paper: '#F6F4EF',
        ink: { 900: '#101820', 500: '#56616B' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      maxWidth: { content: '1200px' },
      boxShadow: {
        glass: '0 8px 40px -12px rgba(0, 0, 0, 0.5)',
        gold: '0 8px 30px -8px rgba(212, 175, 55, 0.35)',
      },
      keyframes: {
        'pulse-node': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.3)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-node': 'pulse-node 2.4s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}
