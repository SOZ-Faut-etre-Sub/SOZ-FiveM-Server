fx_version "cerulean"
games {"gta5"}
lua54 "yes"

shared_scripts {"shared/*.lua", "config.lua", "storages/*.lua"}

client_scripts {"client/main.lua", "client/player.lua", "client/keys.lua", "client/bin.lua"}

server_scripts {
    "@oxmysql/lib/MySQL.lua",
    "server/classes/*.lua",
    "server/main.lua",
    "server/containers.lua",
    "server/command.lua",
    "server/actions.lua",
    "server/events.lua",
}

ui_page("html/index.html")
files {"html/index.html", "html/assets/*", "html/banner/*"}

dependencies {"oxmysql", "qb-core", "soz-hud", "menuv", "qb-target"}
