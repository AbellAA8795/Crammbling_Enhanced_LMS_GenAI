import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Inside Docker, file-change events from the host don't always reach
    // the container, so docker-compose turns on polling.
    watch: { usePolling: process.env.VITE_USE_POLLING === 'true' },
  },
});
