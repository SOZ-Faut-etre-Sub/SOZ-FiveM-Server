fx_version "cerulean"
lua54 "yes"
game "common"

shared_scripts {
    "config.lua",
    "shared/*.lua",
}

client_scripts {
    "client/main.lua",
    "client/modules/*.lua",
}

server_scripts {
    "server/main.lua",
    "server/modules/*.lua",
}

dependencies {"/onesync", "qb-core"}
