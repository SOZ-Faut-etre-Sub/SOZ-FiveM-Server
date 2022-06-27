const path = require('path');
const chokidar = require('chokidar');
const fs = require('fs');

function hmr(file, callback) {
    const filePath = path.resolve(__dirname, '..', file);
    const watcher = chokidar.watch(filePath);

    watcher.on('change', () => {
        setTimeout(() => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                callback(data);
            });
        }, 200);
    });
}

module.exports.hmr = hmr;
