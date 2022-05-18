fx_version "cerulean"
game "gta5"

description "soz-utils"
version "1.0.0"

shared_script "config.lua"
client_script "client/*.lua"
server_scripts {"@oxmysql/lib/MySQL.lua", "server/*.lua"}

files {"components/welcome/welcome.html", "components/welcome/*.jpg"}

ui_page "components/welcome/welcome.html"

lua54 "yes"
