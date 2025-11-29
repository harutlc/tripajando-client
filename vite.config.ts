import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 3000
    },
    resolve: {
        alias: {
            '@': "./src",
            '@components': './src/components',
            '@pages': './src/pages',
            '@services': './src/services',
            '@hooks': './src/hooks',
            '@contexts': './src/contexts',
            '@utils': './src/utils',
            '@types': './src/types',
            '@assets': './src/assets',
            '@styles': './src/styles',
        }
    },

    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler']],
            },
        }),
    ],
})
