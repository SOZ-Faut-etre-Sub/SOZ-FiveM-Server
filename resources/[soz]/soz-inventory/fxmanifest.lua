fx_version 'cerulean'
games { 'gta5' }
lua54 'yes'

client_scripts {
    '@menuv/menuv.lua',
    'client/main.lua',
}

server_scripts {
    'server/main.lua',
    'server/command.lua',
}

dependencies {
    'qb-core',
    'qb-weapons',
    'soz-hud',
    'dpemotes',
    'menuv',
}
