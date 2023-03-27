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
            },
            animation: {
                defilement: 'defilement 7s infinite linear',
            },
        },
    },
    plugins: [require('tailwind-scrollbar')],
    variants: {
        scrollbar: ['rounded'],
    },
};
