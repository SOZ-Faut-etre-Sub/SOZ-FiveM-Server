fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "Driving licenses - car, truck, motorcycle"

shared_script "config.lua"

client_script {
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",
    "client.lua",
}

server_script "server.lua"
