import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In development the Django backend runs on :8000; proxy so the app stays same-origin like production.
const backend = process.env.VITE_BACKEND_URL ?? 'http://localhost:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': backend,
      '/media': backend,
      '/admin': backend,
      '/django-static': backend,
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks: they change less often than site code, so browsers can keep them cached.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return 'react'
          if (/node_modules\/(motion|framer-motion|motion-dom|motion-utils)\//.test(id)) return 'motion'
          return undefined
        },
      },
    },
    // three.js (~530 kB minified, ~134 kB gzipped) is the only chunk above Vite's 500 kB default. It is loaded on demand by the
    // homepage hero only, never for reduced-motion visitors, so the limit is raised just enough to cover it.
    chunkSizeWarningLimit: 560,
  },
})
