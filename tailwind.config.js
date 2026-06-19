/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0a0a0b', 800: '#111114', 700: '#18181b' },
        steel: '#6B7280',
        gold: { DEFAULT: '#ff5a1f', soft: '#ff7a45' },
        paper: '#F6F4EF',
        ink: { 900: '#101820', 500: '#56616B' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      maxWidth: { content: '1200px' },
    },
  },
  plugins: [],
}
