Citizen.CreateThread(function()
    -- BLIP
    QBCore.Functions.CreateBlip("food", {
        name = FoodConfig.Blip.Name,
        coords = FoodConfig.Blip.Coords,
        sprite = FoodConfig.Blip.Icon,
        color = FoodConfig.Blip.Color,
        scale = FoodConfig.Blip.Scale,
    })
end)
