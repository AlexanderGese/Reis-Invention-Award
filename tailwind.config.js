/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-purple': '#1a1a2e',
      },
      backgroundColor: {
        'glass-dark': 'rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};