fx_version "cerulean"
game "gta5"

description "soz phone"

ui_page "public/index.html"

client_script {"client.js", "build/client.js", "client/*.lua"}
server_script {"server.js", "build/server.js"}

files {"config.json", "public/index.html", "public/**/*", "build/nui/*"}

dependency {"soz-props-phone"}
