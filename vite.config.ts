import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/bar-portfolio/',
  build: {
    rollupOptions: {
      // Multi-page: index.html is the portfolio app. The business/ and lab/
      // entries used to mount a marketing React app here (src/marketing/*,
      // src/lab/*); on 2026-05-31 those surfaces moved to the Next.js app at
      // https://barmoshe.github.io/bar_builds/. The HTML inputs are still
      // listed below so Vite ships them, but each one is now a tiny static
      // redirect stub (meta-refresh + canonical to the new origin); no
      // marketing JS bundles for these routes anymore. Keep them listed until
      // SEO has fully migrated, then drop the inputs and the folders.
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
