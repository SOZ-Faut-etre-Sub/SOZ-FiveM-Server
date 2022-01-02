fx_version 'cerulean'
game 'gta5'

description 'QB-Multicharacter'
version '1.0.0'

shared_script 'config.lua'
client_script 'client/main.lua'
server_script 'server/main.lua'

ui_page 'html/index.html'

files {
	'html/index.html',
	'html/style.css',
	'html/reset.css',
	'html/profanity.js',
	'html/script.js'
}

dependencies {
    'qb-core',
    'qb-spawn'
}

lua54 'yes'