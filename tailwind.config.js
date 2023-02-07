/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#387a5b',
        'brand-secondary': '#667790',
      }
    },
  },
  plugins: [],
}