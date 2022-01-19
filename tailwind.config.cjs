/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				foreground: '#141414'
			},
			backgroundImage: {
				'background-image': "url('/background_pattern.png')"
			}
		}
	},
	plugins: []
};
