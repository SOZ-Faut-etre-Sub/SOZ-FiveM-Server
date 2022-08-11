fx_version "cerulean"
games {"gta5"}

description "soz core"

ui_page "public/index.html"

client_script {"client.js", "build/client.js"}
server_script {"server.js", "build/server.js"}

files {"public/index.html", "public/assets/*", "build/nui.js"}
