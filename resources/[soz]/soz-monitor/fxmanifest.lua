fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "Log / Metrics management for SOZ"

shared_scripts {"config.lua", "shared/*.lua"}

server_scripts {
    "@oxmysql/lib/MySQL.lua",
    "server/main.lua",
    "server/log.lua",
    "server/metric.lua",
    "server/event.lua",
    "server/prometheus/inventory.lua",
    "server/prometheus/money.lua",
    "server/prometheus/player.lua",
    "server/prometheus/upw.lua",
    "server/prometheus/mtp.lua",
    "server/prometheus/http.lua",
}

client_scripts {"client/log.lua"}

dependency "qb-core"
