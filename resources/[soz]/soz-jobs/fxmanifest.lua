fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "job entreprise et pole emploie"

shared_scripts {"config.lua", "config/jobs/*.lua"}

client_script {
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",
    "@menuv/menuv.lua",
    "client/main.lua",
    "client/functions.lua",
    "client/adsl.lua",
    "client/pedlist.lua",
    "client/spawnped.lua",
    "client/livraison.lua",
    "client/pole.lua",
    "client/metal.lua",
    "client/religion.lua",
    "client/bell.lua",
    "client/menu.lua",
    "client/utils/*.lua",
    "client/jobs/*.lua",
}

server_script {
    "@oxmysql/lib/MySQL.lua",
    "server/main.lua",
    "server/grade.lua",
    "server/functions.lua",
    "server/temporary.lua",
    "server/objects.lua",
    "server/jobs/*.lua",
}

dependencies {"qb-target"}
