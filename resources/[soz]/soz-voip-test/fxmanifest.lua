fx_version "cerulean"
lua54 "yes"
game "common"

shared_scripts {"config.lua", "shared/*.lua"}

client_scripts {
    "client/modules/*.lua",
    "client/main.lua",
}

--server_scripts {"server/main.lua", "server/state/*.lua", "server/modules/*.lua"}

dependencies {"/onesync", "qb-core"}
