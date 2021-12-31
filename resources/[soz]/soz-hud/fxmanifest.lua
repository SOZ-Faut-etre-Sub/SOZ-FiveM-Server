fx_version 'cerulean'
games { 'gta5' }
lua54 'yes'

ui_page 'ui/index.html'

files {
    'ui/index.html',
    'ui/app.js',
    'ui/elements/*.js',
    'ui/app.css',
    'ui/sprite.svg',
}

client_scripts {
    'client/main.lua',
    'client/hud_components.lua',
}

dependency 'qb-core'
