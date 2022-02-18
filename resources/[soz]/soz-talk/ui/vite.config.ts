import {defineConfig} from 'vite'
import preact from '@preact/preset-vite'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/html/',
    build: {
        outDir: '../html',
        emptyOutDir: true,
    },
    resolve: {
        alias: [
            {find: '@components', replacement: path.resolve(__dirname, './src/components')},
            {find: '@assets', replacement: path.resolve(__dirname, './src/assets')},
        ]
    },
    plugins: [preact()]
})
