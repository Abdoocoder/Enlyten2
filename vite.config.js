import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
  },
  // Suppress specific deprecated warnings from plugins
  logLevel: 'info',
  onWarn(warning, warn) {
    if (warning.code === 'DEPRECATED_ESBUILD') return;
    warn(warning);
  }
})
