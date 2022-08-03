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

server_scripts {
    "@oxmysql/lib/MySQL.lua",
    "server/main.lua",
    "server/carwash.lua",
    "server/custom.lua",
    "server/dealership.lua",
    "server/flatbed.lua",
    "server/fuel.lua",
    "server/garage.lua",
    "server/utils.lua",
    "server/vehicle.lua",
    "server/vehiclekeys.lua",
    "server/dealership/*.lua",
}

dependencies {"qb-core", "soz-hud", "menuv", "qb-target", "PolyZone"}
