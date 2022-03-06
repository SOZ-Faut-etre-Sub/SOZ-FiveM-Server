fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "Driving School - car, truck, motorcycle"

shared_script "config.lua"

client_scripts {"@PolyZone/client.lua", "@PolyZone/BoxZone.lua", "client/*.lua"}

server_script "server.lua"

dependencies {"qb-core", "qb-target", "soz-hud"}
