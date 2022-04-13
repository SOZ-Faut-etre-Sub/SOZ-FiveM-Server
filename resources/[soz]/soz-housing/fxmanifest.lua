fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "soz-housing"

shared_scripts {"config.lua"}

client_script {
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",
    "@menuv/menuv.lua",
    "client/*.lua",
}

server_script {
    "@oxmysql/lib/MySQL.lua",
    "server/*.lua",
}