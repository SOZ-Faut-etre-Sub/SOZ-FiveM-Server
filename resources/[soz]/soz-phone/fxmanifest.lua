fx_version "cerulean"
game "gta5"

client_scripts {"dist/client/client.js", "client/*.lua"}

server_script {"dist/server/server.js"}

ui_page "html/index.html"

files {"config.json", "html/index.html", "html/**/*"}

dependency {"screenshot-basic", "soz-props-phone"}
