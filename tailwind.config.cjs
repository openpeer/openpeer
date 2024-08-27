// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */

const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			animation: {
				pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				spin: 'spin 1s linear infinite'
			},
			keyframes: {
				pulse: {
					'0%, 100%': { opacity: 1 },
					'50%': { opacity: 0.5 }
				},
				spin: {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' }
				}
			},
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
