const { createConfig } = require('./webpack.config.base.js');

module.exports = (env, argv) => {
    const clientConfig = createConfig({ client: './src/client.ts' }, argv.mode === 'production', 9000, 'node');
    const serverConfig = createConfig({ server: './src/server.ts' }, argv.mode === 'production', 9001, 'node');

    return [clientConfig, serverConfig];
};
