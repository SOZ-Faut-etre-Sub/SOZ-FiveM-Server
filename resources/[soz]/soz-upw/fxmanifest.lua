fx_version "cerulean"
games {"gta5"}
lua54 "yes"

shared_scripts {"config.lua"}

client_scripts {"client/*.lua"}

server_scripts {
    "@oxmysql/lib/MySQL.lua",
    "server/facilities/oop.lua",
    "server/facilities/facility.lua",
    "server/facilities/*.lua",
    "server/*.lua",
}

dependencies {"oxmysql", "qb-core"}
