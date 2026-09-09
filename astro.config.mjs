import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.civitaslearning.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
