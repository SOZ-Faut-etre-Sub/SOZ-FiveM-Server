fx_version 'cerulean'
games { 'gta5' }
lua54 'yes'

shared_scripts {
    'shared/table.lua',
    'config.lua',
    'storage/*.lua',
}

client_scripts {
    '@menuv/menuv.lua',
    'client/main.lua',
    'client/player.lua',
}

server_scripts {
    'server/main.lua',
    'server/containers/*.lua',
    'server/command.lua',
    'server/actions.lua',
}

ui_page 'ui/index.html'

files {
    'ui/index.html',
    'ui/img/*.png',
    'ui/css/style.css',
    'ui/js/inventory_item.js',
    'ui/js/inventory_item.js',
    'ui/js/app.js',
}

dependencies {
    'qb-core',
    'qb-weapons',
    'soz-hud',
    'dpemotes',
    'menuv',
}
