/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-dark': '#0D0D12',
        'app-pink': '#FF1B8D',
        'app-gray': '#1E1E24',
      }
    },
  },
  plugins: [],
}

