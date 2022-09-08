fx_version "cerulean"
lua54 "yes"
game "common"

shared_scripts {"config.lua", "shared/*.lua"}

client_scripts {
    "client/filter/context/*",
    "client/filter/submix/*",
    "client/filter/registry.lua",
    "client/filter/context.lua",
    "client/filter/submix.lua",
    "client/modules/*.lua",
    "client/main.lua",
    "client/blockscreen.lua",
    "client/events.lua",
    "client/exports.lua",
}

server_scripts {"server/main.lua", "server/zumble.lua", "server/state/*.lua", "server/modules/*.lua"}

dependencies {"/onesync", "qb-core"}
