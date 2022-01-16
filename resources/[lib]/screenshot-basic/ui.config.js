const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
    entry: './ui/src/main.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inlineSource: '.(js|css)$',
            template: './ui/index.html',
            filename: 'ui.html'
        }),
        new HtmlWebpackInlineSourcePlugin()
    ],
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
	output: {
		filename: 'ui.js',
		path: __dirname + '/dist/'
	},
};