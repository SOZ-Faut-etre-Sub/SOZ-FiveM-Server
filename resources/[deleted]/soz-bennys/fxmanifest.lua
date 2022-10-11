fx_version "cerulean"
game "gta5"

description "soz-bennys"
version "1.0.0"

shared_script {"config.lua", "@soz-inventory/shared/table.lua"}

client_scripts {
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",
    "@menuv/menuv.lua",
    "client/main.lua",
    "client/functionsApply.lua",
    "client/functionsGet.lua",
    "client/functionsPreview.lua",
    "client/functionsRestore.lua",
    "client/menubennys.lua",
    "client/menugarage.lua",
    "client/menuf3.lua",
    "client/menucloakroom.lua",
    "client/shop.lua",
}

server_scripts {"@oxmysql/lib/MySQL.lua", "server/*.lua"}

dependencies {"menuv", "PolyZone"}

lua54 "yes"

