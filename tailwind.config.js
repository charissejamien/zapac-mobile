/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'header-blue': '#4A6FA5',
        'accent-green': '#6CA89A',
        'input-bg': '#F3EEE6',
        'error-red': '#EA4335',
      },
    },
  },
  plugins: [],
};