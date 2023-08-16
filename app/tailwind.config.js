/** @type {import('tailwindcss').Config} */

const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-manrope)', ...fontFamily.sans]
			},
			colors: {
				cyan: {
					600: '#020AD4'
				}
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
};
