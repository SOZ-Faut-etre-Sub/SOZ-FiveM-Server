const { createConfig } = require('./webpack.config.base.js');

module.exports = (env, argv) => {
    return createConfig({ nui: './src/nui.tsx' }, argv.mode === 'production', 9000);
};
