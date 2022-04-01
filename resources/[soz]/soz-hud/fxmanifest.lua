fx_version "cerulean"
games {"gta5"}
lua54 "yes"

ui_page "html/index.html"

files {"themes/*", "html/index.html", "html/assets/*"}

shared_script "config.lua"

client_scripts {
    "client/utils/*.lua",
    "client/main.lua",
    "client/no_reticule.lua",
    "client/hud_components.lua",
    "client/notifications.lua",
    "client/input.lua",
    "client/compass.lua",
    "client/streetname.lua",
    "client/minimap.lua",
    "client/news.lua",
}

dependency "qb-core"
