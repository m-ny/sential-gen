/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Source Serif 4"', 'serif'],
      },
      colors: {
        black: '#000000',
        darkgray: {
          100: '#111111',
          200: '#1A1A1A',
          300: '#1F1F1F',
        },
        white: {
          DEFAULT: '#FFFFFF',
          muted: '#D1D1D1',
          dimmed: '#999999',
        },
      },
      animation: {
        'pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};