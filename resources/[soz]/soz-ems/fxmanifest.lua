fx_version "cerulean"
games {"gta5"}
lua54 "yes"

description "job ems"

shared_script "config.lua"

client_script {"client/*.lua", "@menuv/menuv.lua"}

server_script {"server/*.lua"}
