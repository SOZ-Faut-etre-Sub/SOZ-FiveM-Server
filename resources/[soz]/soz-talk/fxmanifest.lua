fx_version "cerulean"
game "gta5"
lua54 "yes"

description "SOZ-Talk"

ui_page("html/ui.html")

files {"html/ui.html", "html/js/script.js", "html/css/style.css", "html/img/cursor.png", "html/img/radio.png"}

shared_script "config.lua"

client_script "client/radio.lua"

server_script "server/radio.lua"
