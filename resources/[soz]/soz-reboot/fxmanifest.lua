fx_version "cerulean"
lua54 "yes"
game "gta5"

shared_script "config.lua"
client_script "client/*.lua"
server_scripts {
    "@oxmysql/lib/MySQL.lua",
    "server/*.lua",
}

dependencies {"qb-core"}
