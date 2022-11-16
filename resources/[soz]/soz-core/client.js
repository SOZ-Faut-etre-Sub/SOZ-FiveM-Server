const hotReload = GetConvar('soz_core_hot_reload', 'false') == 'true';

if (hotReload) {
    console.log('[soz-core] hot module reload enabled');
    onNet('soz-core:__development__:hot-reload', content => {
        console.log('[soz-core] [hmr] reloading client file');
        emit('soz_core.__internal__.stop_application');

        eval(content);
    });

    setTimeout(() => {
        SendNuiMessage(
            JSON.stringify({
                type: 'soz-core-nui-load',
                mode: 'dev',
            })
        );
    }, 1000);
} else {
    setTimeout(() => {
        SendNuiMessage(
            JSON.stringify({
                type: 'soz-core-nui-load',
                mode: 'production',
            })
        );
    }, 1000);
}
