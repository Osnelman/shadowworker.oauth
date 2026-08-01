import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('recharts')) {
              return 'recharts'
            }
            if (id.includes('lottie-react') || id.includes('lottie-web')) {
              return 'lottie'
            }
            return 'vendor'
          }
        }
      }
    }
  }
})
