fx_version "cerulean"
games {"gta5"}

shared_scripts {
    "config.lua",
    "config/*.lua",
    "shared/utils.lua",
    "shared/fuel-station.lua",
    "@qb-core/shared/locale.lua",
    "locales/fr.lua",
}

client_scripts {
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",
    "@menuv/menuv.lua",
    "client/dealership/*.lua",
    "client/*.lua",
}

server_scripts {"@oxmysql/lib/MySQL.lua", "server/*.lua"}

dependencies {"qb-core", "soz-hud", "menuv", "qb-target", "PolyZone"}
