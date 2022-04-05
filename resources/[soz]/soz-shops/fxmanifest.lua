fx_version "cerulean"
games {"gta5"}
lua54 "yes"

shared_scripts {"config/*.lua", "config/datasource/*.json"}

client_scripts {
    "@menuv/menuv.lua",
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",
    "@soz-character/client/skin/menu/menu.lua",

    "client/location/*.lua",
    "client/main.lua",
    "client/shops/*.lua",
    "client/shops.lua",
}
server_scripts {"server/main.lua"}

dependencies {"qb-core", "PolyZone", "qb-target", "soz-hud", "menuv", "soz-character"}
