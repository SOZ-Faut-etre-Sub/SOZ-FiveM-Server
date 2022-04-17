fx_version "cerulean"
games {"gta5"}
lua54 "yes"

client_scripts {
    "@PolyZone/client.lua",
    "@PolyZone/BoxZone.lua",

    "client/main.lua",
    "client/location/*.lua",
    "client/event.lua",
}
dependencies {"PolyZone"}
