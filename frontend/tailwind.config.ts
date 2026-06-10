import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2563EB', hover: '#1D4ED8' },
        secondary: { DEFAULT: '#14B8A6', hover: '#0F9688' },
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

export default config;
