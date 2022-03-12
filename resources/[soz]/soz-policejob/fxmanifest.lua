fx_version "cerulean"
lua54 "yes"
game "gta5"

description "SOZ Job Police"

shared_scripts {"config.lua"}

client_scripts {"client/main.lua"}

server_scripts {"@oxmysql/lib/MySQL.lua", "server/main.lua"}
