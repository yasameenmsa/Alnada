/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1d92cf',
        secondary: '#9dc03e',
      },
      fontFamily: {
        arabic: ['Noto Sans Arabic', 'sans-serif'],
        sans: ['Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};