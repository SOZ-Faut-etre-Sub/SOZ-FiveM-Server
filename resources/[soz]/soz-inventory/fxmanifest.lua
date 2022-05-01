fx_version "cerulean"
games {"gta5"}
lua54 "yes"

shared_scripts {"shared/*.lua", "config.lua", "storages/*.lua"}

client_scripts {"client/main.lua", "client/player.lua", "client/keys.lua", "client/bin.lua"}

server_scripts {
    "@oxmysql/lib/MySQL.lua",
    "server/main.lua",

    "server/containers/base.lua",
    "server/containers/ammo.lua",
    "server/containers/armory.lua",
    "server/containers/bin.lua",
    "server/containers/boss_storage.lua",
    "server/containers/fridge.lua",
    "server/containers/player.lua",
    "server/containers/seizure.lua",
    "server/containers/stash.lua",
    "server/containers/storage.lua",
    "server/containers/storage_tank.lua",
    "server/containers/tanker.lua",
    "server/containers/trunk.lua",

    "server/command.lua",
    "server/actions.lua",
    "server/events.lua",
    "server/props.lua",
}

ui_page("html/index.html")
files {"html/index.html", "html/assets/*"}

dependencies {"oxmysql", "qb-core", "qb-weapons", "soz-hud", "menuv", "qb-target"}
