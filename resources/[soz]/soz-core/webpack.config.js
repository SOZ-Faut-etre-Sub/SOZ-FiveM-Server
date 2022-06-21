const path = require('path');

module.exports = (env, argv) => {
    const baseDirectory = argv.mode === 'production' ? 'build' : 'dev';

    return {
        entry: {
            server: './src/server.ts',
            client: './src/client.ts',
        },
        devtool: false,
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, baseDirectory),
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "swc-loader",
                        options: {
                            jsc: {
                                parser: {
                                    syntax: "typescript",
                                    jsx: true,
                                },
                                target: "es2016",
                            }
                        }
                    }
                }
            ]
        }
    };
}
