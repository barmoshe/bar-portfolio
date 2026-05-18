import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/bar-portfolio/',
  build: {
    rollupOptions: {
      // Multi-page: index.html is the portfolio app; business/index.html is
      // the Hebrew marketing page (src/marketing/*); business/en/index.html is
      // its English canonical mirror (same React app, EN-only pre-paint script,
      // EN OG/JSON-LD) for crawlers and English-language link previews. Folder
      // layout gives clean /business/ and /business/en/ URLs on GitHub Pages.
      input: {
        main: 'index.html',
        business: 'business/index.html',
        businessEn: 'business/en/index.html',
        backoffice: 'backoffice/index.html',
      },
    },
  },
});
