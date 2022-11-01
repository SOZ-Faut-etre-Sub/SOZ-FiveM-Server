const hotReload = GetConvar('soz_phone_hot_reload', 'false') == 'true';

if (hotReload) {
    console.log('[soz-phone] hot module reload enabled');
    onNet('soz-phone:__development__:hot-reload', content => {
        console.log('[soz-phone] [hmr] reloading client file');
        emit('soz_phone.__internal__.stop_application');

        eval(content);
    });

    setTimeout(() => {
        SendNuiMessage(
            JSON.stringify({
                type: 'soz-phone-nui-load',
                mode: 'dev',
            })
        );
    }, 5000);
} else {
    setTimeout(() => {
        SendNuiMessage(
            JSON.stringify({
                type: 'soz-phone-nui-load',
                mode: 'production',
            })
        );
    }, 5000);
}
