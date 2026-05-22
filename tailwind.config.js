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
        'header-blue': '#4B6FA8',
        'accent-green': '#5A9E82',
        'input-bg': '#EDE6D3',
        'error-red': '#E53935',
      },
    },
  },
  plugins: [],
};