/**
----------------------- [ MenuV ] -----------------------
-- GitHub: https://github.com/ThymonA/menuv/
-- License: GNU General Public License v3.0
--          https://choosealicense.com/licenses/gpl-3.0/
-- Author: Thymon Arens <contact@arens.io>
-- Name: MenuV
-- Version: 1.0.0
-- Description: FiveM menu library for creating menu's
----------------------- [ MenuV ] -----------------------
*/
const HTML_WEBPACK_PLUGIN = require('html-webpack-plugin');
const VUE_LOADER_PLUGIN = require('vue-loader/lib/plugin');
const COPY_PLUGIN = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './source/app/load.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: { appendTsSuffixTo: [/\.vue$/] }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new VUE_LOADER_PLUGIN(),
        new HTML_WEBPACK_PLUGIN({
            inlineSource: '.(js|css)$',
            template: './source/app/html/menuv.html',
            filename: 'menuv.html'
        }),
        new COPY_PLUGIN({
            patterns: [
                { from: 'source/app/html/assets/css/main.css', to: 'assets/css/main.css' },
                { from: 'source/app/html/assets/css/native_theme.css', to: 'assets/css/native_theme.css' },
                { from: 'source/app/html/assets/fonts/SignPainterHouseScript.woff', to: 'assets/fonts/SignPainterHouseScript.woff' },
                { from: 'source/app/html/assets/fonts/TTCommons.woff', to: 'assets/fonts/TTCommons.woff' }
            ],
        })
    ],
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
    output: {
        filename: './assets/js/menuv.js',
        path: __dirname + '/dist/'
    }
};