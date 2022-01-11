const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const RemovePlugin = require('remove-files-webpack-plugin');
const SentryCliPlugin = require('@sentry/webpack-plugin');
const { RewriteFrames } = require('@sentry/integrations');
const buildPath = path.resolve(__dirname, '../../../resources/[lib]/npwd/dist');

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

  if (process.env.IS_SENTRY) {
    plugins.push(
      new SentryCliPlugin({
        url: 'https://sentry.projecterror.dev',
        release: process.env.npm_package_version,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: 'project-error',
        project: 'npwd-s',
        include: ['dist/server'],
        ignore: ['node_modules'],
        validate: true,
        integrations: [
          new RewriteFrames({
            //   root: rootDir,
            //   iteratee: (frame) => {
            //     if (!frame.filename || frame.filename === '') return frame;
            //
            //     frame.filename = frame.filename = frame.filename.replace('@npwd', '');
            //     return frame;
            //   },
          }),
        ],
      }),
    );
  }

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
