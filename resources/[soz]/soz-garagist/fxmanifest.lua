fx_version 'cerulean'
game 'gta5'

description 'soz-garagist'
version '1.0.0'

shared_script 'config.lua'

client_scripts {
	"@PolyZone/client.lua",
	"@PolyZone/BoxZone.lua",
	"@menuv/menuv.lua",
    'client/*.lua',
}

server_scripts {
	'@oxmysql/lib/MySQL.lua',
    'server/*.lua'
}

dependencies {"menuv", "PolyZone"}

lua54 'yes'

