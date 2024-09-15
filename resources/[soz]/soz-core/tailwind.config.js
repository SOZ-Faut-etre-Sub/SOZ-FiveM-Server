const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

const radialGradientPlugin = plugin(
    function ({ matchUtilities, theme }) {
        matchUtilities(
            {
                // map to bg-radient-[*]
                'bg-radient': value => ({
                    'background-image': `radial-gradient(${value},var(--tw-gradient-stops))`,
                }),
            },
            { values: theme('radialGradients') }
        );
    },
    {
        theme: {
            radialGradients: _presets(),
        },
    }
);

/**
 * utility class presets
 */
function _presets() {
    const shapes = ['circle', 'ellipse'];
    const pos = {
        c: 'center',
        t: 'top',
        b: 'bottom',
        l: 'left',
        r: 'right',
        tl: 'top left',
        tr: 'top right',
        bl: 'bottom left',
        br: 'bottom right',
    };
    let result = {};
    for (const shape of shapes)
        for (const [posName, posValue] of Object.entries(pos))
            result[`${shape}-${posName}`] = `${shape} at ${posValue}`;

    return result;
}

module.exports = {
    darkMode: 'class',
    content: [
        './src/nui/**/*.{vue,js,ts,jsx,tsx}',
        './../../../../private/soz-core-src/nui/**/*.{vue,js,ts,jsx,tsx}',
        './private/nui/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
        screens: {
            sm: '1680px',
            md: '1920px',
            lg: '2560px',
            xl: '3440px',
        },
        fontFamily: {
            sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            arial: ['Arial', 'Helvetica', 'serif'],
            noto: ['Noto Serif', 'serif'],
            mono: ['input-mono', 'monospace'],
            lato: ['Lato', ...defaultTheme.fontFamily.sans],
            prompt: ['Prompt', 'sans-serif'],
            kreditback: ['"Kredit Back"', 'sans-serif'],
            'delight-sunset': ['Delight-Sunset', 'sans-serif'],
            digital7: ['Digital-7', 'sans-serif'],
        },
        extend: {
            colors: {
                'sozedex-green': '#308032',
                'race-current': '#33a844',
                'race-notcurrent': '#778694',
            },
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
                'display-in-long': 'display-in 5s',
            },
            fontSize: {
                '2xs': '.6rem',
                xsm: '.8rem',
                '2.5xl': [
                    '2.75rem',
                    {
                        lineHeight: '2.75rem',
                        letterSpacing: '-0.01em',
                        fontWeight: '500',
                    },
                ],
            },
            dropShadow: {
                bg: '0 0 2px rgba(7, 7, 7, 0.7)',
            },
            colors: {
                // Generated from https://uicolors.app
                'spring-green': {
                    50: '#eefff5',
                    100: '#d7ffe9',
                    200: '#b2ffd5',
                    300: '#54ffa4',
                    400: '#33f58f',
                    500: '#09de6e',
                    600: '#01b857',
                    700: '#059048',
                    800: '#0a713c',
                    900: '#0a5d34',
                    950: '#00341b',
                },
                aquamarine: {
                    50: '#eefff5',
                    100: '#d7ffeb',
                    200: '#b2ffd8',
                    300: '#7fffbf',
                    400: '#33f595',
                    500: '#09de74',
                    600: '#01b85d',
                    700: '#05904c',
                    800: '#0a713f',
                    900: '#0a5d36',
                    950: '#00341c',
                },
                mirage: {
                    50: '#f2f6fc',
                    100: '#e0ebf9',
                    200: '#c9dcf4',
                    300: '#a4c5ec',
                    400: '#78a7e2',
                    500: '#5888d9',
                    600: '#446ecc',
                    700: '#3a5bbb',
                    800: '#354b98',
                    900: '#2f4179',
                    950: '#151b30',
                },
                'vivid-violet': {
                    50: '#fbf6fd',
                    100: '#f6ecfb',
                    200: '#edd8f6',
                    300: '#e1b8ef',
                    400: '#d08ee4',
                    500: '#b962d3',
                    600: '#933eab',
                    700: '#833497',
                    800: '#6d2c7c',
                    900: '#5c2966',
                    950: '#391042',
                },
                turquoise: {
                    50: '#effef9',
                    100: '#cafdef',
                    200: '#95fae0',
                    300: '#58f0cf',
                    400: '#30ddbd',
                    500: '#0dbfa1',
                    600: '#079a84',
                    700: '#0a7b6b',
                    800: '#0e6157',
                    900: '#105148',
                    950: '#02312d',
                },
                grey: {
                    50: '#f5f6f6',
                    100: '#e6e7e7',
                    200: '#cfd2d1',
                    300: '#aeb2b1',
                    400: '#858b89',
                    500: '#6a706f',
                    600: '#5a605f',
                    700: '#4d5151',
                    800: '#434747',
                    900: '#3b3e3e',
                    950: '#252727',
                },
                error: {
                    50: '#fff0f1',
                    100: '#ffdddf',
                    200: '#ffc1c4',
                    300: '#ff969c',
                    400: '#ff5a63',
                    500: '#ff2733',
                    600: '#fb0714',
                    700: '#d4010c',
                    800: '#7e1117',
                    900: '#71090e',
                    950: '#380003',
                },
            },
        },
    },
    plugins: [require('tailwind-scrollbar'), radialGradientPlugin],
    variants: {
        scrollbar: ['rounded'],
    },
};
