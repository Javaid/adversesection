import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: ['.localhost', '.localhost.me'],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: false,
        // CRITICAL: Forward the original host header so backend can validate subdomain tenant
        headers: {
          'X-Forwarded-Host': 'localhost:5173', // Will be overridden by actual request host
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // 🔐 CRITICAL: Preserve the original Host header from the frontend subdomain
            // This allows the backend to validate that the user's tenant matches the subdomain
            proxyReq.setHeader('X-Forwarded-Host', req.headers.host);
            proxyReq.setHeader('X-Forwarded-Proto', req.headers['x-forwarded-proto'] || 'http');
          });
        },
      },
    },
  },
})
