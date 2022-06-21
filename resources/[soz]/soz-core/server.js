const hmr = require('./src/hmr.js')
const hotReload = GetConvar("soz_core_hot_reload", "false") == "true";

if (hotReload) {
    console.log("[soz-core] hot module reload enabled");

    hmr.hmr('dev/server.js', (newContent) => {
        console.log("[soz-core] hmr: reloading dist/server.js");

        eval(newContent);
    });

    hmr.hmr('dev/client.js', (newContent) => {
        console.log("[soz-core] hmr: reloading dist/client.js");

        emitNet("soz-core:__development__:hot-reload", -1, newContent)
    });
}
