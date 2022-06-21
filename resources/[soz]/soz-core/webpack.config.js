const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env, argv) => {
    const devtool = argv.mode === 'production' ? false : 'eval-cheap-source-map';

    return {
        entry: {
            server: './src/server.ts',
            client: './src/client.ts',
        },
        target: 'node',
        devtool,
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'build'),
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
        },
        plugins: [new ESLintPlugin()],
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
                                    jsx: true,
                                    decorators: true,
                                },
                                target: 'es2016',
                            },
                        },
                    },
                },
            ],
        },
    };
};
