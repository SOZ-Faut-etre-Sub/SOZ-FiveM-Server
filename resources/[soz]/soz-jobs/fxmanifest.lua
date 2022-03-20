fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "job entreprise et pole emploie"

shared_script "config.lua"

client_script {
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",
    "@menuv/menuv.lua",
    "client/*.lua",
    "client/utils/*.lua",
    "client/utils/*.js",
}

server_script {
    "@oxmysql/lib/MySQL.lua",
    "server/*.lua",
}

dependencies {"qb-target"}
