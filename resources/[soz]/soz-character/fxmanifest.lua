fx_version "cerulean"
game "gta5"

description "Soz-character"
version "1.0.0"

ui_page "html/index.html"

files {"html/index.html", "html/assets/*"}

shared_script "config.lua"

client_script {
    "@menuv/menuv.lua",

    "client/main.lua",

    "client/skin/apply.lua",
    "client/skin/camera.lua",
    "client/skin/create.lua",

    "client/loading/sky_cam.lua",
    "client/loading/create.lua",
    "client/loading/logging.lua",
    "client/loading/events.lua",
}

server_script {"@oxmysql/lib/MySQL.lua", "server/main.lua", "server/loading.lua", "server/create.lua"}

dependencies {"qb-core"}

lua54 "yes"
