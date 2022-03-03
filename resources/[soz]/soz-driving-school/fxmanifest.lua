fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "Driving School - car, truck, motorcycle"

shared_script "config.lua"

client_scripts {
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",
    "client/ui.lua",
    "client/exam.lua",
    "client/penalties.lua",
    "client/events.lua",
    "client/main.lua",
}

server_script "server.lua"

ui_page "ui/index.html"
files {"ui/index.html", "ui/driving-school.js", "ui/driving-school.css", "ui/background-licenses.png"}

dependencies {"qb-core", "qb-target", "soz-hud"}
