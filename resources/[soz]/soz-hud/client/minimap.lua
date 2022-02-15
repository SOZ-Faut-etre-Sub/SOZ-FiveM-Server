Citizen.CreateThread(function()
    RequestStreamedTextureDict("soz_minimap", false)
    while not HasStreamedTextureDictLoaded("soz_minimap") do
        Wait(100)
    end

    AddReplaceTexture("platform:/textures/graphics", "radarmasksm", "soz_minimap", "radarmasksm")
end)
