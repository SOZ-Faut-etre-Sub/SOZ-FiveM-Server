const { createConfig } = require('./webpack.config.base.js');

module.exports = (env, argv) => {
    const clientConfig = createConfig(
        { client: './src/client/client.ts' },
        argv.mode === 'production',
        { SOZ_PHONE_IS_SERVER: false, SOZ_PHONE_IS_CLIENT: true },
        undefined,
        'node'
    );

    const serverConfig = createConfig(
        { server: './src/server/server.ts' },
        argv.mode === 'production',
        { SOZ_PHONE_IS_SERVER: true, SOZ_PHONE_IS_CLIENT: false },
        undefined,
        'node'
    );

    return [clientConfig, serverConfig];
};
