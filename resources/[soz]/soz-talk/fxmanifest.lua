fx_version "cerulean"
game "gta5"
lua54 "yes"

description "SOZ-Talk"

ui_page("html/index.html")

files {"html/index.html", "html/assets/*"}

shared_script "config.lua"

client_scripts {
    "client/main.lua",
    "client/radio.lua",
    "client/cibi.lua",
    "client/megaphone.lua",
    "client/microphone.lua",
}

server_script "server/main.lua"
