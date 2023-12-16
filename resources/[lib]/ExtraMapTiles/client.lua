-- DO NOT MODIFY!
vBitmapTileSizeX = 4500.0
vBitmapTileSizeY = 4500.0
vBitmapStartX = -4140.0
vBitmapStartY = 8400.0

-- Overlay ID.
overlay = 0

-- Will store the keys of the currently drawn tiles.
drawnTiles = {}

-- List to store the dummy blip handles.
dummyBlips = {}

-- Function that will create a new tile.
function createTile(tileName)

    
    -- Early exit for invalid tile name.
    if extraTiles[tileName] == nil then
        return
    end

    -- Get the tile's object.
    local extraTile = extraTiles[tileName]

    if extraTile.txd == nil or extraTile.txn == nil then
        return
    end 

    

    -- Get the texture info, alpha, centering and rotation.
    local textureDictionary = extraTile.txd
    local textureName = extraTile.txn
    local alpha = extraTile.alpha or defaultAlpha
    local centered = extraTile.centered or false
    local rotation = extraTile.rotation or 0.0

    -- Load the required texture.
    loadTextureDictionary(textureDictionary)

    -- Get the width and height of the texture.
    local xTexture, yTexture, _ = table.unpack(GetTextureResolution(textureDictionary, textureName))

    -- Compute the scale ratios.
    local xScale = vBitmapTileSizeX / xTexture * 100
    local yScale = vBitmapTileSizeY / yTexture * 100

    -- Tile was configurated to use XY coordinates.
    if extraTile.x ~= nil and extraTile.y ~= nil then

        -- Compute offsets from given coordinates since other functionalities
        -- such as extendPauseMenuMapBounds() work with offsets, not with XY coords directly.
        extraTile.xOffset = (extraTile.x - vBitmapStartX) / vBitmapTileSizeX
        extraTile.yOffset = (extraTile.y - vBitmapStartY) / vBitmapTileSizeY     
    end
    
    
    -- Get the offsets, convert to float.
    local xOffset = extraTile.xOffset * 1.0
    local yOffset = extraTile.yOffset * (-1.0)
    

    -- Compute X and Y coordinates based on the offsets.
    local x = vBitmapStartX + xOffset * vBitmapTileSizeX
    local y = vBitmapStartY - yOffset * vBitmapTileSizeY

    
    
    -- Convert alpha to an INT.
    alpha = math.floor(math.abs(alpha))  
    -- Convert rotation to FLOAT.
    rotation = rotation * 1.0  

    -- Call the Scaleform function.
    CallMinimapScaleformFunction(overlay, "ADD_SCALED_OVERLAY")
    -- Push the parameters onto the stack.
    ScaleformMovieMethodAddParamTextureNameString(textureDictionary)
    ScaleformMovieMethodAddParamTextureNameString(textureName)
    ScaleformMovieMethodAddParamFloat(x)
    ScaleformMovieMethodAddParamFloat(y)
    ScaleformMovieMethodAddParamFloat(rotation)
    ScaleformMovieMethodAddParamFloat(xScale)
    ScaleformMovieMethodAddParamFloat(yScale)
    ScaleformMovieMethodAddParamInt(alpha)
    ScaleformMovieMethodAddParamBool(centered)
    EndScaleformMovieMethod()

    -- Mark the texture as no longer needed.
    SetStreamedTextureDictAsNoLongerNeeded(textureDictionary)

    -- Add it to the drawn tiles table.
    table.insert(drawnTiles, tileName)
end

-- Function that deletes a tile.
function deleteTile(tileName)

    local id = -1

    for i = 1, #drawnTiles do
        if drawnTiles[i] == tileName then
            id = i
            table.remove(drawnTiles, id)
            break
        end
    end

    if id == -1 then
        return
    end

    -- Call the remove scaleform function.
    CallMinimapScaleformFunction(overlay, "REM_OVERLAY");
    -- Push the parameter onto the stack.
    ScaleformMovieMethodAddParamInt(id - 1)
    EndScaleformMovieMethod()
end

-- Function that will draw all tiles in the extraTiles table.
function createAllTiles()

    local extraTilesNames = getTableKeys(extraTiles)
    if extraTilesNames == nil then
        return
    end

    -- Iterate all extra tiles.
    for i = 1, #extraTilesNames do
        
        -- Get the current tile's key.
        local tileName = extraTilesNames[i]

        -- Create the new tile.
        createTile(tileName)
    end

    if #dummyBlips == 0 then
        extendPauseMenuMapBounds()
    end
end

-- Function that will delete all tiles that are currently drawn.
function deleteAllTiles()
    
    -- Delete the tile at index 1. The table will shift the remaining
    -- elements' indices.
    for i = 1, #drawnTiles do
        deleteTile(drawnTiles[1])
    end

    if #dummyBlips ~= 0 then
        resetPauseMenuMapBounds()
    end
end

-- Function that returns true if the tile with the specified name is currently drawn
-- or false otherwise.
function isTileDrawn(tileName)
    if tileName == nil then
        return false
    end

    for i = 1, #drawnTiles do
        if drawnTiles[i] == tileName then
            return true
        end
    end

    return false
end

-- Function that will let you move outside the normal bounds of the
-- pause menu map.
function extendPauseMenuMapBounds()

    if #dummyBlips ~= 0 then
        resetPauseMenuMapBounds()
    end


    local extraTilesNames = drawnTiles
    if extraTilesNames == nil then
        return
    end

    -- Set starting values.
    local xMinOffset = extraTiles[extraTilesNames[1]].xOffset or 0
    local xMaxOffset = extraTiles[extraTilesNames[1]].xOffset or 0
    local yMinOffset = extraTiles[extraTilesNames[1]].yOffset or 0
    local yMaxOffset = extraTiles[extraTilesNames[1]].yOffset or 0

    -- Find min and max values for xOffset and yOffset.
    for i = 1, #extraTilesNames do
        local extraTile = extraTiles[extraTilesNames[i]]

        if extraTile.xOffset < xMinOffset then
            xMinOffset = extraTile.xOffset
        end
        
        if extraTile.xOffset > xMaxOffset then
            xMaxOffset = extraTile.xOffset
        end

        if extraTile.yOffset < yMinOffset then
            yMinOffset = extraTile.yOffset
        end

        if extraTile.yOffset > yMaxOffset then
            yMaxOffset = extraTile.yOffset
        end
    end

    -- Create 4 invisible blips at the corners of the furthest tiles
    -- to create something like a bounding box in which all other
    -- tiles are included. This could possibly be improved to use 2
    -- blips instead of 4. 

    createDummyBlip(vBitmapStartX + xMinOffset * vBitmapTileSizeX - vBitmapTileSizeX / 2,
        vBitmapStartY + yMaxOffset * vBitmapTileSizeY + vBitmapTileSizeY / 2)

    createDummyBlip(vBitmapStartX + xMinOffset * vBitmapTileSizeX - vBitmapTileSizeX / 2,
        vBitmapStartY + (yMinOffset - 1) * vBitmapTileSizeY - vBitmapTileSizeY / 2)

    createDummyBlip(vBitmapStartX + (xMaxOffset + 1) * vBitmapTileSizeX + vBitmapTileSizeX / 2,
        vBitmapStartY + (yMinOffset - 1) * vBitmapTileSizeY - vBitmapTileSizeY / 2)

    createDummyBlip(vBitmapStartX + (xMaxOffset + 1) * vBitmapTileSizeX + vBitmapTileSizeX / 2,
        vBitmapStartY + yMaxOffset * vBitmapTileSizeY + vBitmapTileSizeY / 2)
end

-- This function will reset the pause menu map's bounds to the default. 
function resetPauseMenuMapBounds()
    for i = 1, #dummyBlips do
        RemoveBlip(dummyBlips[i])
    end

    dummyBlips = {}
end

-- Function that will create an invisible blip.
function createDummyBlip(x, y)
    local dummyBlip = AddBlipForCoord(x, y, 1.0)
    SetBlipDisplay(dummyBlip, 4)
    SetBlipAlpha(dummyBlip, 0)

    table.insert(dummyBlips, dummyBlip)
end

-- Loads a minimap overlay from a given path. 
function loadMinimapOverlay(gfxFilePath)
    local _overlay = AddMinimapOverlay(gfxFilePath)

    while not HasMinimapOverlayLoaded(_overlay) do
        Citizen.Wait(0)
    end

    SetMinimapOverlayDisplay(_overlay, 0.0, 0.0, 100.0, 100.0, 100.0)

    return _overlay
end

-- Loads a texture dictionary into memory.
function loadTextureDictionary(textureDictionary)
    if not HasStreamedTextureDictLoaded(textureDictionary) then
        RequestStreamedTextureDict(textureDictionary, false)
        while not HasStreamedTextureDictLoaded(textureDictionary) do
            Citizen.Wait(0)
        end
    end
end

-- Function that converts the keys of a dictionary to an alphabetically-sorted list.
function getTableKeys(keyset)
    local list = {}

    for key, _ in pairs(keyset) do
        table.insert(list, key)
    end

    table.sort(list)

    return list
end

exports("createAllTiles", createAllTiles)
exports("deleteAllTiles", deleteAllTiles)
exports("createTile", createTile)
exports("deleteTile", deleteTile)
exports("extendPauseMenuMapBounds", extendPauseMenuMapBounds)
exports("resetPauseMenuMapBounds", resetPauseMenuMapBounds)
exports("isTileDrawn", isTileDrawn)


Citizen.CreateThread(function()
    -- Load the minimap overlay.
    overlay = loadMinimapOverlay("MINIMAP_LOADER.gfx")

    -- Draw all tiles.
    createAllTiles()
end)
