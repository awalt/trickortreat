import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		// This makes the server accessible on your local network,
		// which is required for ngrok to connect to it.
		host: true,

		// This tells Vite to allow connections from your ngrok domain.
		allowedHosts: [
			'.ngrok-free.app'
		]
	},
	plugins: [sveltekit()]
});