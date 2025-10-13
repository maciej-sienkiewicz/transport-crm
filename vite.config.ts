import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@/app': path.resolve(__dirname, './src/app'),
            '@/pages': path.resolve(__dirname, './src/pages'),
            '@/features': path.resolve(__dirname, './src/features'),
            '@/widgets': path.resolve(__dirname, './src/widgets'),
            '@/shared': path.resolve(__dirname, './src/shared'),
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
        },
    },
});