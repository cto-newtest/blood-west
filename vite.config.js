import { defineConfig } from 'vite';

export default defineConfig({
  base: '/blood-west/',
  server: {
    port: 3000,
    open: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
});
