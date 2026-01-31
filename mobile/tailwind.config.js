/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Matching our web app tokens
        primary: '#8b5cf6', // Violet 500
        secondary: '#1e293b', // Slate 800
        background: '#0a0a0a',
        card: '#171717',
      }
    },
  },
  plugins: [],
}
