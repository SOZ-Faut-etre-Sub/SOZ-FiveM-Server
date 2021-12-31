fx_version 'cerulean'
games { 'gta5' }
lua54 'yes'

ui_page 'ui/index.html'

files {
    'ui/index.html',
    'ui/app.js',
    'ui/elements/*.js',
    'ui/fonts/*.ttf',
    'ui/app.css',
    'ui/sprite.svg',
}

shared_script 'config.lua'

client_scripts {
    'client/main.lua',
    'client/no_reticule.lua',
    'client/hud_components.lua',
    'client/notifications.lua',
    'client/input.lua',
}

dependency 'qb-core'
