fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "job entreprise et pole emploie"

shared_script "config.lua"

client_script {
    "client/adsl.lua",
    "client/pedlist.lua",
    "client/spawnped.lua",
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",
    "@menuv/menuv.lua",
    "client/livraison.lua",
    "client/pole.lua",
    "client/metal.lua",
    "client/religion.lua",
}

server_script "server/server.lua"

dependencies {"qb-target"}
