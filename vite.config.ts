import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    
    return {
      server: {
        host: '0.0.0.0',
        port: 5000,
        allowedHosts: true
      },
      preview: {
        host: '0.0.0.0',
        port: 5000,
        allowedHosts: true
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@assets': path.resolve(__dirname, 'attached_assets')
        }
      }
    };
});
