fx_version "cerulean"
games {"gta5"}
lua54 "yes"

shared_scripts {"config.lua"}

client_scripts {
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",
    "@menuv/menuv.lua",
    "client/main.lua",
    "client/field.lua",
    "client/menu.lua",
    "client/resell.lua",
}

server_scripts {"@oxmysql/lib/MySQL.lua", "server/field.lua", "server/main.lua"}

dependencies {"oxmysql", "qb-core", "menuv"}
