import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/bar-portfolio/',
  build: {
    rollupOptions: {
      // Multi-page: index.html is the portfolio app, business.html is the
      // separate Hebrew marketing page (src/marketing/*).
      input: {
        main: 'index.html',
        business: 'business.html',
      },
    },
  },
});
