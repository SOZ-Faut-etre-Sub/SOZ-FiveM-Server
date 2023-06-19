fx_version "cerulean"
games {"gta5"}
lua54 "yes"

shared_script "config.lua"

client_scripts {
    "@menuv/menuv.lua",
    "@soz-character/client/skin/clothing.lua",

    "client/main.lua",
    "client/polyzone.lua",
    "client/mapper_menu/*.lua",
    "client/spectate.lua",
    "client/feature.lua",
}

server_scripts {
    "@oxmysql/lib/MySQL.lua",
    "server/main.lua",
    "server/module/*.lua",
    "server/housing.lua",
    "server/feature.lua",
}

ui_page "html/index.html"
files {"html/index.html", "html/index.js"}

dependencies {"qb-core", "menuv", "soz-character", "soz-jobs"}
