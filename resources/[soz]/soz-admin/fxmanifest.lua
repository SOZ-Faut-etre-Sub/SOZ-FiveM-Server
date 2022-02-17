fx_version "cerulean"
games {"gta5"}
lua54 "yes"

shared_script "config.lua"

client_scripts {"@menuv/menuv.lua", "client/main.lua", "client/noclip.lua", "client/tpm.lua", "client/spectate.lua"}

server_scripts {"server/main.lua"}

dependencies {"qb-core", "menuv"}
