fx_version "cerulean"
games {"gta5"}
lua54 "yes"

shared_scripts {"config.lua"}

client_scripts {"@menuv/menuv.lua", "client/*.lua"}

server_scripts {
    "@oxmysql/lib/MySQL.lua",
    "server/facilities/oop.lua",
    "server/facilities/facility.lua",
    "server/facilities/plant.lua",
    "server/facilities/inverter.lua",
    "server/facilities/terminal.lua",
    "server/facilities/pollution-manager.lua",
    "server/main.lua",
    "server/pollution.lua",
    "server/production.lua",
    "server/storage.lua",
    "server/resale.lua",
}

dependencies {"oxmysql", "qb-core"}
