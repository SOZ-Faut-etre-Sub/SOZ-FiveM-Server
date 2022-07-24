fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "job entreprise et pole emploi"

shared_scripts {"config.lua", "config/jobs/*.lua"}

client_script {
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",
    "@PolyZone/ComboZone.lua",
    "@menuv/menuv.lua",
    "client/*.lua",
    "client/utils/*.lua",
    "client/jobs/**/*.lua",
}

server_script {
    "@oxmysql/lib/MySQL.lua",
    "server/main.lua",
    "server/grade.lua",
    "server/functions.lua",
    "server/temporary.lua",
    "server/objects.lua",
    "server/classes/*.lua",
    "server/jobs/**/*.lua",
}

ui_page "client/nui/index.html"
files {"client/nui/index.html"}

dependencies {"qb-target", "soz-utils"}
