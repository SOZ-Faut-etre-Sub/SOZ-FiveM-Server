const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');

const createConfig = (entry, isProduction, variables = {}, port = undefined, target = undefined) => {
    const plugins = [
        new ESLintPlugin(),
        new webpack.DefinePlugin({
            ...variables,
            SOZ_CORE_IS_PRODUCTION: isProduction,
        }),
    ];

    if (!isProduction && target !== 'node') {
        plugins.push(new ReactRefreshWebpackPlugin());
    }

    const privatePath = path.resolve(__dirname, '..', '..', '..', '..', 'private', 'soz-core-src');
    const privateAlias = [];

    if (fs.existsSync(privatePath)) {
        privateAlias.push(privatePath + '/*');
    } else {
        privateAlias.push('private/*');
    }

    return {
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
            allowedHosts: 'all',
            client: {
                webSocketURL: 'ws://localhost:9000/ws',
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
                                    optimizer: {
                                        simplify: true,
                                        globals: {
                                            vars: {
                                                ...variables,
                                                SOZ_CORE_IS_PRODUCTION: JSON.stringify(isProduction),
                                            },
                                        },
                                    },
                                },
                                keepClassNames: true,
                                baseUrl: '.',
                                paths: {
                                    '@public/*': ['src/*'],
                                    '@private/*': privateAlias,
                                    '@core/*': ['src/core/*'],
                                },
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
