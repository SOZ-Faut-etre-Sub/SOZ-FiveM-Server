fx_version "cerulean"
lua54 "yes"
game "common"

shared_scripts {
    "config.lua",
    "shared/*.lua",
    "classes/*.lua",
}

client_scripts {
    "client/main.lua",
    "client/targets.lua",
    "client/channels.lua",
    "client/transmission.lua",
    "client/modules/*.lua",
}

server_scripts {
    "server/main.lua",
    "server/state/*.lua",
    "server/modules/*.lua",
}

dependencies {"/onesync", "qb-core"}
