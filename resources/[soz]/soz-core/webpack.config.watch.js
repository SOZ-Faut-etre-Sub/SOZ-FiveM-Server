const { createConfig } = require('./webpack.config.base.js');
const path = require('path');

module.exports = (env, argv) => {
    const buildPath = path.resolve(__dirname, 'build');
    const clientConfig = createConfig(
        { client: './src/client.ts' },
        argv.mode === 'production',
        { SOZ_CORE_IS_SERVER: 'false', SOZ_CORE_IS_CLIENT: 'true' },
        undefined,
        'node'
    );

    const serverConfig = createConfig(
        { server: './src/server.ts' },
        argv.mode === 'production',
        { SOZ_CORE_IS_SERVER: 'true', SOZ_CORE_IS_CLIENT: 'false', __dirname: '"' + buildPath + '"' },
        undefined,
        'node'
    );

    return [clientConfig, serverConfig];
};
