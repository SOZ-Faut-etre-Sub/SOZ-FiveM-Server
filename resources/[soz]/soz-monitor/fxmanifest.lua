fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "Log / Metrics management for SOZ"

shared_scripts {"config.lua", "shared/*.lua"}

server_scripts {"@oxmysql/lib/MySQL.lua", "server/main.lua", "server/log.lua", "server/event.lua"}

client_scripts {"client/log.lua"}

dependency "qb-core"
