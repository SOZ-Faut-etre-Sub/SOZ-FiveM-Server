fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "Log / Metrics management for SOZ"

shared_scripts {"config.lua", "shared/*.lua"}

server_scripts {"server/http.lua", "server/main.lua", "server/log.lua", "server/metric.lua"}

client_scripts {"client/log.lua"}

dependency "qb-core"
