/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#14B8A6',
        accent: '#F59E0B',
        success: '#22C55E',
        danger: '#EF4444',
        background: '#F8FAFC',
        surface: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
