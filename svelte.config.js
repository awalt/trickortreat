import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
// Import the adapter
import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // Set the adapter
    adapter: adapter({
      // See below for options.
      routes: {
        include: ['/*'],
        exclude: ['<all>']
      }
    })
  },
  preprocess: vitePreprocess()
};

export default config;