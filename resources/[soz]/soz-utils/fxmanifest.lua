fx_version "cerulean"
game "gta5"

description "soz-utils"
version "1.0.0"

shared_script "config.lua"
client_script "client/*.lua"
server_scripts {"@oxmysql/lib/MySQL.lua", "server/*.lua"}

data_file "FIVEM_LOVES_YOU_4B38E96CC036038F" "events.meta"
data_file "FIVEM_LOVES_YOU_341B23A2F0E0F131" "popgroups.ymt"

files {"events.meta", "popgroups.ymt", "relationships.dat"}

lua54 "yes"
