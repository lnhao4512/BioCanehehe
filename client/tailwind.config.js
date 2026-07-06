/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        company: {
          dark: '#1a1a1a',
          darkGreen: '#1b3b2c',
          green: '#2d6a4f',
          lightGreen: '#40916c',
          lighterGreen: '#52b788',
          offWhite: '#fdfcf8',
          cream: '#fbf5df',
          orange: '#e07a5f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      }
    },
  },
  plugins: [],
}
