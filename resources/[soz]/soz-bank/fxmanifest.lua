fx_version "cerulean"
games { "gta5" }
lua54 "yes"

shared_scripts { "config.lua" }

client_scripts {
    "client/nui.lua",
}

server_scripts {
    "@oxmysql/lib/MySQL.lua",

    "server/main.lua",
    "server/accounts.lua",
    "server/invoices.lua",
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
dependencies { "oxmysql", "qb-core" }
