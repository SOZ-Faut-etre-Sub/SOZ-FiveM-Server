fx_version 'cerulean'
game 'gta5'

author 'BerkieB'
description 'An optimized interaction system for FiveM, based on qtarget and bt-target'
version '5.0.0'

ui_page 'html/index.html'

client_scripts {
	'@PolyZone/client.lua',
	'@PolyZone/BoxZone.lua',
	'@PolyZone/EntityZone.lua',
	'@PolyZone/CircleZone.lua',
	'@PolyZone/ComboZone.lua',
	'init.lua',
	'client.lua',
}

files {
	'data/*.lua',
	'html/*.html',
	'html/css/*.css',
	'html/js/*.js'
}

lua54 'yes'

dependency 'PolyZone'