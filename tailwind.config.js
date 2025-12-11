/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A2342',
        gold: '#F5C451',
        'soft-green': '#A6D49F',
        'soft-red': '#D66D6D',
        cream: '#FFF8ED',
      },
    },
  },
  plugins: [],
}

