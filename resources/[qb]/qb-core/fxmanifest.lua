fx_version 'cerulean'
game 'gta5'

description 'QB-Core'
version '1.0.0'

shared_scripts {
    'shared/locale.lua',
	'locale/fr.lua',
    'config.lua',
    'shared/main.lua',
    'shared/items.lua',
    'shared/jobs.lua',
    'shared/vehicles.lua',
    'shared/gangs.lua',
    'shared/weapons.lua',
    'shared/uuid.lua',
    'shared/trunks.lua',
}

client_scripts {
    'client/main.lua',
    'client/functions.lua',
    'client/loops.lua',
    'client/events.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
    'server/functions.lua',
    'server/player.lua',
    'server/events.lua',
    'server/commands.lua',
    'server/debug.lua'
}

dependencies {
    'oxmysql',
    'progressbar'
}

lua54 'yes'
