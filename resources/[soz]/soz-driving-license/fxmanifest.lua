fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "Driving licenses - car, truck, motorcycle"

shared_script "config.lua"

client_scripts {
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",
    "client/ui.lua",
    "client/penalties.lua",
    "client/main.lua",
}

server_script "server.lua"

dependencies {
    "qb-core",
    "qb-target",
    "soz-hud"
}
