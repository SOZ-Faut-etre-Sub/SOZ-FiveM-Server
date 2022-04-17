fx_version "cerulean"
games {"gta5"}
lua54 "yes"

shared_scripts {"config/*.lua", "config/datasource/*.json"}

client_scripts {
    "@menuv/menuv.lua",
    "@soz-character/client/skin/menu/menu.lua",

    "client/main.lua",
    "client/shops/*.lua",
    "client/shops.lua",
}
server_scripts {"server/main.lua"}

dependencies {"qb-core", "qb-target", "soz-hud", "soz-locations", "menuv", "soz-character"}
