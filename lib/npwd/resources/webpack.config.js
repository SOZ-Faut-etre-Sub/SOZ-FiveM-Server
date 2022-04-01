const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const RemovePlugin = require('remove-files-webpack-plugin');
const buildPath = path.resolve(__dirname, '../../../resources/[soz]/soz-phone/dist');

const server = () => {
  const plugins = [
    new RemovePlugin({
      before: {
        include: [path.resolve(buildPath, 'server')],
      },
      watch: {
        include: [path.resolve(buildPath, 'server')],
      },
    }),
    // Ignore cardinal as its optional
    new webpack.IgnorePlugin(/^cardinal$/, /./),
  ];

  return {
    entry: './server/server.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ['ts-loader'],
          exclude: /node_modules/,
        },
      ],
    },
    plugins,
    devtool: 'source-map',
    optimization: {
      minimize: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'server.js',
      path: path.resolve(buildPath, 'server'),
    },
    target: 'node',
  };
};

const client = () => {
  return {
    entry: './client/client.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ['ts-loader'],
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new RemovePlugin({
        before: {
          include: [path.resolve(buildPath, 'client')],
        },
        watch: {
          include: [path.resolve(buildPath, 'client')],
        },
      }),
    ],
    optimization: {
      minimize: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'client.js',
      path: path.resolve(buildPath, 'client'),
    },
  };
};

const global = () => {
  return {
    entry: './empty.ts',
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: path.resolve("../config.json"), to: path.resolve(buildPath, '../config.json') },
        ],
      })
    ]
  };
};

module.exports = [global, server, client];
