-- Manifest data.
fx_version "cerulean"
games {"gta5"}
lua54 "yes"

-- Resource information.
name "Extra Map Tiles"
description "Adds extra tiles for textures on the minimap and pause menu map."
version "1.2.0"
author "L1CKS"

-- Files.
files {
    "MINIMAP_LOADER.gfx"    -- Always first in the list.
}

client_scripts {
    "config.lua",
	"client.lua"
}
