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
    "client/skin/create/camera.lua",
    "client/skin/create/default.lua",
    "client/skin/create/menu.lua",
    "client/skin/create/menu_model.lua",
    "client/skin/create/menu_body.lua",
    "client/skin/create/menu_face.lua",
    "client/skin/create/menu_cloth.lua",
    "client/skin/create/create.lua",

    "client/loading/sky_cam.lua",
    "client/loading/create.lua",
    "client/loading/logging.lua",
    "client/loading/events.lua",
}

server_script {"@oxmysql/lib/MySQL.lua", "server/main.lua", "server/loading.lua", "server/create.lua"}

dependencies {"qb-core"}

lua54 "yes"
