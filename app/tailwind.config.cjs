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
					200: '#7B80FE',
					600: '#020AD4',
					800: '#03088D'
				}
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
};
