fx_version "cerulean"
games {"gta5"}
lua54 "yes"

client_scripts {"client/token.lua"}

server_scripts {
    "server/main.lua",
    "server/authorization.lua",
    "server/token.lua",
    "server/news.lua",
    "server/reboot.lua",
    "server/http.lua",
}

dependencies {}
