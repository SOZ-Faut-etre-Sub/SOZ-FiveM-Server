fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "job entreprise et pole emploie"

shared_script "config.lua"

<<<<<<< HEAD
client_script {"client/adsl.lua" , "client/pedlist.lua" , "client/spawnped.lua", "@PolyZone/client.lua", "@PolyZone/BoxZone.lua", "client/livraison.lua"}

server_script "server/server.lua"


=======
client_script {
    "client/adsl.lua",
    "client/pedlist.lua",
    "client/spawnped.lua",
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",
    "client/livraison.lua",
}

server_script "server/server.lua"

>>>>>>> main
