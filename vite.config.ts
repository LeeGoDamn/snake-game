import { defineConfig } from 'vite'

export default defineConfig({
  base: '/snake-game/',
  build: {
    target: 'esnext',
    minify: 'terser',
    cssCodeSplit: false,
    outDir: 'docs',
  },
  server: {
    port: 5173,
  },
})
