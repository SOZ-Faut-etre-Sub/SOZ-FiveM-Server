const path = require('path');
const chokidar = require('chokidar');
const fs = require('fs');

function hmr(file, callback) {
    const filePath = path.resolve(__dirname, '..', file);
    const watcher = chokidar.watch(filePath);

    watcher.on('change', file => {
        const content = fs.readFileSync(file, 'utf8');

        callback(content);
    });
}

module.exports.hmr = hmr;
