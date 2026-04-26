import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/bar-portfolio/',
  build: {
    rollupOptions: {
      // Multi-page: index.html is the portfolio app; business/index.html is
      // the separate Hebrew marketing page (src/marketing/*). Folder layout
      // gives a clean /business/ URL on GitHub Pages instead of /business.html.
      input: {
        main: 'index.html',
        business: 'business/index.html',
      },
    },
  },
});
