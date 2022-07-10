const hmr = require('./src/hmr.js');
const hotReload = GetConvar('soz_phone_hot_reload', 'false') == 'true';

if (hotReload) {
    console.log('[soz-phone] hot module reload enabled');

    hmr.hmr('build/server.js', newContent => {
        console.log('[soz-phone] hmr: reloading dist/server.js');
        emit('soz_phone.__internal__.stop_application');

        eval(newContent);
    });

    hmr.hmr('build/client.js', newContent => {
        console.log('[soz-phone] hmr: reloading dist/client.js');

        emitNet('soz-phone:__development__:hot-reload', -1, newContent);
    });
}
