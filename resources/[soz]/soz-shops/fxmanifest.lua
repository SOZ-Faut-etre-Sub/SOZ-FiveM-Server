fx_version "cerulean"
games {"gta5"}
lua54 "yes"

shared_scripts {"config/*.lua", "config/*.json"}

client_scripts {
    "@menuv/menuv.lua",
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",

    "client/location/main.lua",
    "client/location/ammunation.lua",
    "client/location/robsliquor.lua",
    "client/location/ltdgasoline.lua",
    "client/location/247supermarket.lua",
    "client/location/tattoo.lua",

    "client/main.lua",
    "client/tattoo.lua",

    "client/shops/base.lua",
    "client/shops/tattoo.lua",

    "client/events.lua",
}
server_scripts {"server/main.lua"}

dependencies {"qb-core", "PolyZone", "qb-target", "soz-hud", "menuv"}
