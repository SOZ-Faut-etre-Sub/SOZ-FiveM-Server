fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "SOZ personal menu"

shared_scripts {"config.lua"}

client_scripts {
    "@menuv/menuv.lua",
    "@soz-character/client/skin/create/default.lua",
    "client/main.lua",
    "client/components/*.lua",
}

ui_page "client/components/welcome.html"
files {"client/components/welcome.html"}

dependencies {"qb-core", "soz-hud", "menuv"}
