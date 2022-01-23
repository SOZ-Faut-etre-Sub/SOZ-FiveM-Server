game { 'gta5', 'rdr3' }

fx_version 'cerulean'
lua54 'yes'

shared_script 'shared.lua'

client_scripts {
    'client/init/proximity.lua',
    'client/init/init.lua',
    'client/init/main.lua',
    'client/module/*.lua',
    'client/*.lua',
}

server_scripts {
    'server/types/*.lua',
}
