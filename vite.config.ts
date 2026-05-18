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
      // EN OG/JSON-LD) for crawlers and English-language link previews.
      // lab/index.html + lab/en/index.html mirror the same pattern for the
      // Lab landing — a sister surface to /business/ with a free no-strings
      // first-build pitch (src/lab/*). Folder layout gives clean /business/,
      // /business/en/, /lab/, and /lab/en/ URLs on GitHub Pages.
      input: {
        main: 'index.html',
        business: 'business/index.html',
        businessEn: 'business/en/index.html',
        lab: 'lab/index.html',
        labEn: 'lab/en/index.html',
        backoffice: 'backoffice/index.html',
      },
    },
  },
});
