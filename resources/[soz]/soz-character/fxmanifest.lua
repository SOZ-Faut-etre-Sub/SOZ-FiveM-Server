fx_version "cerulean"
game "gta5"

description "Soz-character"
version "1.0.0"

ui_page "html/index.html"

files {"html/index.html", "html/assets/*"}

shared_script "config.lua"
client_script "client/main.lua"
server_script "server/main.lua"

dependencies {"qb-core"}

lua54 "yes"
