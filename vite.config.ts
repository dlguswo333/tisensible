import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig({
  base: undefined,
  build: {
    target: 'baseline-widely-available',
    outDir: 'dist',
    sourcemap: true,
    minify: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [react(), tailwindcss()],
});
