import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import inertia from '@inertiajs/vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
            fonts: [
                bunny('Space Grotesk', {
                    weights: [500, 600, 700],
                }),
                bunny('Inter', {
                    weights: [400, 500, 600],
                }),
                bunny('JetBrains Mono', {
                    weights: [400, 500],
                }),
            ],
        }),
        react(),
        inertia(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            'ziggy-js': fileURLToPath(new URL('./vendor/tightenco/ziggy/dist/index.esm.js', import.meta.url)),
        },
    },
    server: {
    	host: '0.0.0.0',
    	port: 5173,
    	watch: {
            ignored: ['**/storage/framework/views/**'],
    	},
    },
});
