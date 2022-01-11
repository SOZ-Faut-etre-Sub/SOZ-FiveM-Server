fx_version "cerulean"
game "gta5"

description "SOZ Mysql migration lib"
version "1.0.0"

server_scripts {"@oxmysql/lib/MySQL.lua", "main.lua", "migrations/**.lua"}

dependencies {"oxmysql"}

lua54 "yes"
