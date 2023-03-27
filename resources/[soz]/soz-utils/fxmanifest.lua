fx_version "cerulean"
game "gta5"

description "soz-utils"
version "1.0.0"

shared_scripts {"config.lua", "shared/items.js"}
client_script "client/*.lua"
server_scripts {"@oxmysql/lib/MySQL.lua", "server/*.lua"}

data_file "FIVEM_LOVES_YOU_4B38E96CC036038F" "events.meta"

files {"components/welcome/welcome.html", "components/welcome/**/*.jpg", "events.meta", "relationships.dat"}

ui_page "components/welcome/welcome.html"

lua54 "yes"
