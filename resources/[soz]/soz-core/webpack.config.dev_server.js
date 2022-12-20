const { createConfig } = require('./webpack.config.base.js');

module.exports = (env, argv) => {
    const config = createConfig({ nui: './src/nui.tsx' }, argv.mode === 'production', {}, 9000);

    config.module.rules.push({
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
    });

    config.module.rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
    });

    return config;
};
