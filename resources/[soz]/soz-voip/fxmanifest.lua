fx_version "cerulean"
lua54 "yes"
game "common"

shared_scripts {"config.lua", "shared.lua"}

client_scripts {
    "client/main.lua",
    "client/submix.lua",
    "client/voice.lua",
    "client/voice.lua",
    "client/module/*.lua",
    "client/events.lua",
    "client/commands/*.lua",
    "client/commands.lua",
}

server_scripts {"server/main.lua", "server/events.lua", "server/store/*.lua", "server/module/*.lua"}

dependencies {"/onesync", "interact-sound"}
