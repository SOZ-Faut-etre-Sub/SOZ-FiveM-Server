module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                ios: {
                    50: '#F2F2F6',
                    100: '#ECECED',
                    600: '#484d56',
                    700: '#393E46',
                    800: '#222831',
                },
            },
            borderRadius: {
                ios: '.8rem',
            },
        },
    },
    plugins: [],
};
