import { defineConfig, sharpImageService } from "astro/config";
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
	experimental: {
		assets: true
	},
  image: {
    service: sharpImageService(),
  },
});
