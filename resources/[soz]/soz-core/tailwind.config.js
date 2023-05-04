const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    darkMode: 'class',
    content: [
        './src/nui/**/*.{vue,js,ts,jsx,tsx}',
        './../../../../private/soz-core-src/nui/**/*.{vue,js,ts,jsx,tsx}',
        './private/nui/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
        screens: {
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1440px',
        },
        fontFamily: {
            sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            arial: ['Arial', 'Helvetica', 'serif'],
            noto: ['Noto Serif', 'serif'],
            mono: ['input-mono', 'monospace'],
            lato: ['Lato', ...defaultTheme.fontFamily.sans],
            prompt: ['Prompt', 'sans-serif'],
        },
        extend: {
            colors: {},
            zIndex: {
                9999: '9999',
            },
            gridTemplateRows: {
                12: 'minmax(0, 1fr), -2rem, repeat(2, minmax(0, 1fr)), -2rem, repeat(3, minmax(0, 1fr)), -2rem, repeat(3, minmax(0, 1fr))',
            },
            gridRowStart: {
                8: '8',
                9: '9',
                10: '10',
                11: '11',
                12: '12',
            },
            keyframes: {
                defilement: {
                    '0%, 29%': { transform: 'translate(0%,0)' },
                    '100%': { transform: 'translate(-100%,0)' },
                },
                'display-in': {
                    '0%': { opacity: '0' },
                    '50%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                'display-persist': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            animation: {
                defilement: 'defilement 7s infinite linear',
                'display-in': 'display-in 3s',
                'display-persist': 'display-persist 1s',
            },
            fontSize: {
                '2xs': '.6rem',
                xsm: '.8rem',
            },
        },
    },
    plugins: [require('tailwind-scrollbar')],
    variants: {
        scrollbar: ['rounded'],
    },
};
