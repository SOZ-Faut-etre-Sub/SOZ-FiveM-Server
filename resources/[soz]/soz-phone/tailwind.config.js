module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                ios: {
                    50: '#F2F2F6',
                    100: '#ECECED',
                    200: '#d2d2d2',
                    600: '#4f545c',
                    700: '#36393f',
                    800: '#2f3136',
                },
            },
            borderRadius: {
                ios: '.8rem',
            },
        },
    },
    plugins: [],
};
