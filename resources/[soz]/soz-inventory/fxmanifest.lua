fx_version "cerulean"
games {"gta5"}
lua54 "yes"

shared_scripts {"shared/table.lua", "config.lua", "storages/*.lua"}

client_scripts {"@menuv/menuv.lua", "client/main.lua", "client/player.lua", "client/bin.lua"}

server_scripts {
    "@oxmysql/lib/MySQL.lua",
    "server/main.lua",

    "server/containers/base.lua",
    "server/containers/armory.lua",
    "server/containers/bin.lua",
    "server/containers/fridge.lua",
    "server/containers/player.lua",
    "server/containers/seizure.lua",
    "server/containers/storage.lua",
    "server/containers/trunk.lua",

    "server/command.lua",
    "server/actions.lua",
    "server/events.lua",
    "server/props.lua",
}

ui_page "ui/index.html"

files {"ui/index.html", "ui/img/*", "ui/css/style.css", "ui/js/inventory_item.js", "ui/js/app.js"}

dependencies {"oxmysql", "qb-core", "qb-weapons", "soz-hud", "soz-monitor", "dpemotes", "menuv", "qb-target"}
