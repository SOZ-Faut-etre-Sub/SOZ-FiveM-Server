function getMapPosition()
    local minimap = {}
    local resX, resY = GetActiveScreenResolution()
    local aspectRatio = GetAspectRatio()
    local scaleX = 1 / resX
    local scaleY = 1 / resY
    local minimapRawX, minimapRawY
    SetScriptGfxAlign(string.byte('L'), string.byte('B'))
    minimapRawX, minimapRawY = GetScriptGfxPosition(-0.0045, 0.002 + (-0.188888))
    minimap.width = scaleX * (resX / (4 * aspectRatio))
    minimap.height = scaleY * (resY / (5.674))
    ResetScriptGfxAlign()
    minimap.leftX = minimapRawX
    minimap.rightX = minimapRawX + minimap.width
    minimap.topY = minimapRawY
    minimap.bottomY = minimapRawY + minimap.height
    minimap.X = minimapRawX + (minimap.width / 2)
    minimap.Y = minimapRawY + (minimap.height / 2)
    return minimap
end

Citizen.CreateThread(function()
    RequestStreamedTextureDict("soz_minimap", false)
    while not HasStreamedTextureDictLoaded("soz_minimap") do
        Wait(100)
    end

    AddReplaceTexture("platform:/textures/graphics", "radarmasksm", "soz_minimap", "radarmasksm")

    SendNUIMessage({event = 'hud_minimap_pos', data = getMapPosition()})

    local minimap = RequestScaleformMovie("minimap")
    SetRadarBigmapEnabled(true, false)
    Wait(0)
    SetRadarBigmapEnabled(false, false)

    while true do
        BeginScaleformMovieMethod(minimap, "SETUP_HEALTH_ARMOUR")
        ScaleformMovieMethodAddParamInt(3)
        EndScaleformMovieMethod()

        Wait(0)
    end
end)
