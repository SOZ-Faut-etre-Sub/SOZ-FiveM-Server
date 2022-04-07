fx_version "cerulean"
games {"gta5"}

ui_page 'html/horodateur.html'

shared_scripts {"config.lua"}

client_scripts {"@PolyZone/client.lua", "@PolyZone/BoxZone.lua", "@menuv/menuv.lua", "client/*.lua"}

server_scripts {"server/*.lua"}

files {
    'html/horodateur.css',
    'html/horodateur.html',
    'html/horodateur.js',
    'html/Brouznouf_Z7_.png',
}

dependencies {"qb-core", "menuv", "qb-target", "PolyZone"}
