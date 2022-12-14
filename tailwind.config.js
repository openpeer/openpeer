/** @type {import('tailwindcss').Config} */

const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    theme: {
      extend: {
        fontFamily: {
          sans: ['var(--font-manrope)', ...fontFamily.sans]
        }
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
