import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 8080,
    strictPort: true,
    open: false
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
