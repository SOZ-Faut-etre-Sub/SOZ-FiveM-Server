fx_version 'cerulean'
games { 'gta5' }
lua54 'yes'

shared_scripts {
    'shared/table.lua',
    'config.lua',
}

client_scripts {
    '@menuv/menuv.lua',
    'client/main.lua',
}

server_scripts {
    'server/container.lua',
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
