const path = require('path');
const chokidar = require('chokidar');
const fs = require('fs');

function hmr(file, callback) {
    const filePath = path.resolve(__dirname, '..', file);
    const watcher = chokidar.watch(filePath);

    watcher.on(
        'change',
        debounce(() => {
            console.log('[hmr] file changed, reloading');
            fs.readFile(filePath, 'utf8', (err, data) => {
                callback(data);
            });
        }, 500)
    );
}

function debounce(func, timeout = 300) {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

module.exports.hmr = hmr;
