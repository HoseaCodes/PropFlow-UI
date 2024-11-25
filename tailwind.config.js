/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'airbnb': '#FF5A5F',
        'airbnb-dark': '#FF385C',
      }
    },
  },
  plugins: [],
}