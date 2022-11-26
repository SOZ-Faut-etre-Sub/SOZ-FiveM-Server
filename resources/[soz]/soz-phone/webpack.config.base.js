const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');

const createConfig = (entry, isProduction, variables = {}, port = undefined, target = undefined) => {
    const plugins = [
        new ESLintPlugin(),
        new webpack.DefinePlugin({
            ...variables,
            SOZ_PHONE_IS_PRODUCTION: isProduction,
        }),
    ];

    if (!isProduction && target !== 'node') {
        plugins.push(new ReactRefreshWebpackPlugin());
    }

    return {
        devtool: isProduction ? false : 'eval-cheap-source-map',
        target: target,
        entry,
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'build'),
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
        },
        plugins,
        devServer: {
            https: false,
            allowedHosts: 'all',
            client: {
                webSocketURL: 'ws://localhost:9001/ws',
            },
            port,
            hot: true,
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'swc-loader',
                        options: {
                            jsc: {
                                parser: {
                                    syntax: 'typescript',
                                    tsx: true,
                                    decorators: true,
                                },
                                target: 'es2020',
                                transform: {
                                    react: {
                                        runtime: 'automatic',
                                        development: !isProduction,
                                        refresh: !isProduction,
                                    },
                                },
                                keepClassNames: true,
                            },
                            sourceMaps: !isProduction,
                            minify: isProduction,
                        },
                    },
                },
            ],
        },
    };
};

module.exports = { createConfig };
