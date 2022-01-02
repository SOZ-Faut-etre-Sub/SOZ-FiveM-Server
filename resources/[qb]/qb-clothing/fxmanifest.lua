fx_version 'cerulean'
game 'gta5'

description 'QB-Clothing'
version '1.0.0'

ui_page 'html/index.html'

shared_script 'config.lua'
server_script 'server/main.lua'
client_script 'client/main.lua'

files {
	'html/index.html',
	'html/style.css',
	'html/reset.css',
	'html/script.js'
}

lua54 'yes'