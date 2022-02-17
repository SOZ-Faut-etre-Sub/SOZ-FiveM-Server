import {defineConfig} from 'vite'
import preact from '@preact/preset-vite'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [preact()],
    resolve: {
        alias: [
            {find: '@components', replacement: path.resolve(__dirname, './src/components')},
            {find: '@routes', replacement: path.resolve(__dirname, './src/routes')},
        ]
    }
})
