fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "SOZ personal menu"

shared_scripts {"config.lua"}

client_scripts {"@menuv/menuv.lua", "client/main.lua", "client/components/*.lua"}

dependencies {"qb-core", "soz-hud", "menuv"}
