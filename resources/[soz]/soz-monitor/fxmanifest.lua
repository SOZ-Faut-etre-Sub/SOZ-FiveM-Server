fx_version 'cerulean'
games { 'gta5' }
lua54 'yes'

description 'Log / Metrics management for SOZ'

shared_scripts {
    'config.lua',
    'shared/*.lua',
}

server_scripts {
    'server/*.lua',
}

dependency 'qb-core'
