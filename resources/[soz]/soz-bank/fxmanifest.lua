fx_version "cerulean"
games {"gta5"}
lua54 "yes"

shared_scripts {"config.lua"}

client_scripts {"@menuv/menuv.lua", "client/main.lua", "client/moneycase.lua", "client/police.lua"}

server_scripts {"@oxmysql/lib/MySQL.lua", "server/main.lua", "server/bank_ped.lua", "server/police.lua"}

dependencies {"oxmysql", "qb-core", "soz-hud", "menuv"}
