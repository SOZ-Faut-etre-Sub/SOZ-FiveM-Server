fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "job ems"

shared_script "config.lua"

client_script {"@menuv/menuv.lua", "@PolyZone/client.lua", "@PolyZone/BoxZone.lua", "client/*.lua"}

server_script {"server/*.lua", "@oxmysql/lib/MySQL.lua"}
