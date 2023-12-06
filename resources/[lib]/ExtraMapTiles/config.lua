--[[
    This is the offsets table. This tells the script where to create new map tiles.    
    The origin point from which offset positions are calculated is defined by the
    vBitmapStartX and vBitmapStartY, same as in the minimap.ymt file. Do not modify
    the vBitmapStartX and vBitmapStartY, or the script will not function correctly.

    The keys of each tile can be arbitrary, maybe something so you can identify them,
    but they have to be unique.

    xOffset represents the number of tiles away from the origin point to place the new
    tile on the X axis. A positive xOffset will place the new tile to the right of the
    origin on the X axis and to the left for negative values.

    Same for yOffset, but on the Y axis. Positive values place it above the origin and
    negative values place it below the origin point.

    If needed, xOffset and yOffset you can omit the xOffset and yOffset fields and use
    just x and y fields that represent in-game XY coordinates.
    
    Remember that the anchor point of all new tiles is the top left corner of the tile,
    unless setting centered to true.

    Other optional fields include are:
    - alpha: sets the alpha of the tile. Ranges from 0 to 100.
    - rotation: Sets the rotation of the tile in a clockwise direction. Ranges from 0 to 360.
    - centered: Sets the tile in the center of the chosen point. Can be true or false.


    Important: By default, one tile's dimensions are 4500x4500. This is useful when creating
    a grid of tiles using in-game XY coordinates so that you can perfectly align them together.
    
]]

-- Extra tiles can be placed at any offets, they don't have to be "connected" to the default
-- map's tiles.
extraTiles = {
    [1] = {x = 4730.0, y = -5145.0, txd = "tile_cayo", txn = "cayo", centered = true},

    -- 2 tiles in the top left corner of the default map.
    --[1] = {xOffset = -1, yOffset = 1, txd = "minimap_extra_tile_1", txn = "extra_tile_1"},
    --[2] = {xOffset = -2, yOffset = 1, txd = "minimap_extra_tile_1", txn = "extra_tile_1", alpha = 50},

    -- Another tile in the middle, on the right side of the default map, but rotated 25 degrees clockwise
    --[3] = {xOffset = 2, yOffset = 0, txd = "minimap_extra_tile_2", txn = "extra_tile_2", alpha = 70, rotation = 25},

    -- Tiles created using in game coordinates instead of offsets.
    --[4] = {x = 0.0, y = 0.0, txd = "minimap_extra_tile_1", txn = "extra_tile_1", centered = true},
    --[5] = {x = 4500.0, y = 0.0, txd = "minimap_extra_tile_1", txn = "extra_tile_1"},
}


-- Default alpha value that will be used if not specified in the extraTiles table.
defaultAlpha = 100
