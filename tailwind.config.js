/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0A1622', 800: '#0B1F3A', 700: '#13283F' },
        steel: '#6B7280',
        gold: { DEFAULT: '#D4AF37', soft: '#E0C074' },
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
