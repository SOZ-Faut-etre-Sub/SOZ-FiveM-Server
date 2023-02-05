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
    "client/invoices.lua",
    "client/moneycase.lua",
}

server_scripts {
    "@oxmysql/lib/MySQL.lua",

    "server/main.lua",
    "server/accounts.lua",
    "server/invoices.lua",
    "server/paycheck.lua",
    "server/washmoney.lua",
    "server/taxes.lua",
    "server/bank-atm.lua",

    "server/accounts/base.lua",
    "server/accounts/player.lua",
    "server/accounts/business.lua",
    "server/accounts/farm.lua",
    "server/accounts/house_safe.lua",
    "server/accounts/offshore.lua",
    "server/accounts/safestorages.lua",
    "server/accounts/bank-atm.lua",
}

ui_page "ui/index.html"

files {"ui/images/logo.png", "ui/style.css", "ui/index.html", "ui/qb-banking.js"}

dependencies {"oxmysql", "cron", "qb-core", "soz-jobs", "soz-hud", "menuv", "PolyZone"}
