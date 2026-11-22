import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/viajes-carolina-delgado-PFY2202/' : '/',
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
  },
}));
