const hotReload = GetConvar("soz_core_hot_reload", "false") == "true";

if (hotReload) {
    console.log("[soz-core] hot module reload enabled");
    onNet("soz-core:__development__:hot-reload", (content) => {
        console.log("[soz-core] [hmr] reloading client file");
        eval(content);
    });
}
