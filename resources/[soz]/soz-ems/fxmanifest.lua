fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "job ems"

shared_script "config.lua"

client_script {"client/main.lua", "client/mort.lua", "client/utilitaire.lua"}

server_script {"server/main.lua"}

