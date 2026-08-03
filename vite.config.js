import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    sourcemap: false
  },
  server: {
    // In dev, the Contact form's fetch('/api/contact') is proxied to the
    // standalone Express server (see server/index.js, run with
    // `npm run server`) so the Resend API key never has to live in
    // anything Vite would bundle for the browser.
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.PORT || 3001}`,
        changeOrigin: true
      }
    }
  }
});
