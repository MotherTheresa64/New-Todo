/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          800: '#1A1A2E',
          900: '#16213E',
        }
      }
    },
  },
  plugins: [],
} 