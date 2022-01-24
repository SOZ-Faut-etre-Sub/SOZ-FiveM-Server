fx_version "cerulean"
games {"gta5"}
lua54 "yes"

shared_scripts {"config.lua"}

client_scripts {
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",
    "@menuv/menuv.lua",
    "client/main.lua",
    "client/nui.lua",
    "client/moneycase.lua",
    "client/police.lua",
}

server_scripts {
    "@oxmysql/lib/MySQL.lua",

    "server/main.lua",
    "server/accounts.lua",
    "server/paycheck.lua",

    "server/accounts/base.lua",
    "server/accounts/player.lua",
    "server/accounts/business.lua",
    "server/accounts/offshore.lua",
    "server/accounts/safestorages.lua",

    "server/police.lua",
}

ui_page "ui/index.html"

files {"ui/images/logo.png", "ui/style.css", "ui/index.html", "ui/qb-banking.js"}

dependencies {"oxmysql", "qb-core", "soz-hud", "menuv", "PolyZone"}
