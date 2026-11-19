import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    hmr: { host: '127.0.0.1', clientPort: 5173 },
    proxy: { '/api': 'http://127.0.0.1:5000' },
  },
  preview: { proxy: { '/api': 'http://127.0.0.1:5000' } },
});
