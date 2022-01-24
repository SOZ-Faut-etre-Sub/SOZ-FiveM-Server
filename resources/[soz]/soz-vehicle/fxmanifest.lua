fx_version "cerulean"
games {"gta5"}
lua54 "yes"

shared_script "config.lua"

client_scripts {"@menuv/menuv.lua", "client/*.lua"}

server_scripts {"@oxmysql/lib/MySQL.lua", "server/concess.lua"}

dependencies {"qb-core", "soz-hud", "menuv", "qb-target"}
