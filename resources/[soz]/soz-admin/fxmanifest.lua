fx_version "cerulean"
games {"gta5"}
lua54 "yes"

client_scripts {
    "client/spectate.lua",
}

server_scripts {
    "@oxmysql/lib/MySQL.lua",
    "server/main.lua",
    "server/module/*.lua",
}

dependencies {"qb-core", "soz-jobs"}
