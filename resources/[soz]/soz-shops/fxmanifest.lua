fx_version "cerulean"
games {"gta5"}
lua54 "yes"

shared_scripts {"config.lua"}

client_scripts {
    "@menuv/menuv.lua",
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",

    "client/location/main.lua",
    "client/location/ammunation.lua",
    "client/location/robsliquor.lua",
    "client/location/ltdgasoline.lua",
    "client/location/247supermarket.lua",

    "client/main.lua",
}
server_scripts {"server/main.lua"}

dependencies {"qb-core", "PolyZone", "qb-target", "soz-hud", "menuv"}
