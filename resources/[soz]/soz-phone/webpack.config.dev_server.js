const { createConfig } = require('./webpack.config.base.js');
const path = require('path');

module.exports = (env, argv) => {
    const config = createConfig(
        { nui: './src/nui/index.tsx' },
        argv.mode === 'production',
        { SOZ_PHONE_IS_SERVER: false, SOZ_PHONE_IS_CLIENT: false },
        9001
    );

    config.module.rules.push({
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
    });

    config.module.rules.push({
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
    });

    config.module.rules.push({
        test: /\.(png|jpe?g|gif)$/i,
        use: ['file-loader'],
    });

    config.module.rules.push({
        test: /\.svg$/,
        enforce: 'pre',
        loader: require.resolve('@svgr/webpack'),
    });

    config.resolve.alias = {
        '@os': path.resolve(__dirname, 'src/nui/os'),
        '@ui': path.resolve(__dirname, 'src/nui/ui'),
        '@apps': path.resolve(__dirname, 'src/nui/apps'),
        '@utils': path.resolve(__dirname, 'src/nui/utils'),
        '@common': path.resolve(__dirname, 'src/nui/common'),
        '@typings': path.resolve(__dirname, 'typings'),
        '@libs': path.resolve(__dirname, 'src/libs'),
    };

    config.resolve.fallback = { url: false };
    config.output.path = path.resolve(__dirname, 'build/nui');

    config.devServer.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    };

    return config;
};
