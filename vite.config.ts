import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
    cssCodeSplit: false,
  },
  server: {
    port: 5173,
  },
})
