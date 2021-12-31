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

client_script 'client/main.lua'

dependency 'qb-core'
