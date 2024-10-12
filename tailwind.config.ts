import type { Config } from 'tailwindcss';
import {
	pg_colors,
	pg_fonts,
	pg_backgrounds,
} from './themes/pg-tailwindcss/tokens.mjs'; // tailwind.config.[ts]

export default {
	content: [
		'./pages/**/*.{php,html}',
		'./partials/**/*.{php,html}',
		'./src/**/*.{js,jsx,ts,tsx,svg}',
		'./_pginfo/**/*.{html,js}',
		'./node_modules/flowbite/**/*.{js,ts}',
	],
	theme: {
		extend: {},
	},
	plugins: [
		require('@pinegrow/tailwindcss-plugin').default({
			colors: pg_colors, // primary, secondary etc
			fonts: pg_fonts,
			backgrounds: pg_backgrounds, // bg-design-image, bg-design-image-large
		}),
		require('flowbite/plugin'),
	],
} satisfies Config;
