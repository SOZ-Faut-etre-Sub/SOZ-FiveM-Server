const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
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
        },
        extend: {
            colors: {},
            zIndex: {
                9999: '9999',
            },
        },
    },
};
