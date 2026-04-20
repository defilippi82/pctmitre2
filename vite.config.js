import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Volvemos al estándar estable

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  optimizeDeps: {
    // Esto es lo más importante para que no te falle la carga del Excel
    include: ['xlsx'],
  }
})