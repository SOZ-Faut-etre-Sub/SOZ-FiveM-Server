fx_version "cerulean"
games {"gta5"}
lua54 "yes"

shared_scripts {"config.lua", "@soz-inventory/shared/table.lua"}

client_scripts {
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",
    "@menuv/menuv.lua",
    "client/main.lua",
    "client/field.lua",
    "client/menu.lua",
    "client/resell.lua",
}

server_scripts {"@oxmysql/lib/MySQL.lua", "server/field.lua", "server/main.lua", "server/degradation.lua"}

dependencies {"oxmysql", "qb-core", "menuv", "soz-inventory"}
