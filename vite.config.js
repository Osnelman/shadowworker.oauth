import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
  },
  // Ajoutez ceci pour que Vite expose les variables d'environnement
  define: { 'process.env': {} }
})
