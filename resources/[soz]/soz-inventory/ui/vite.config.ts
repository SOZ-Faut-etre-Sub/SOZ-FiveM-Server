import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/html/',
    build: {
        outDir: '../html',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`
            }
        }
    },
    assetsInclude: [
        '**/*.jpg',
    ],
    resolve: {
        alias: [
            {find: '@components', replacement: path.resolve(__dirname, './src/components')},
            {find: '@assets', replacement: path.resolve(__dirname, './src/assets')},
        ]
    },
    plugins: [react()]
})
