QBCore = exports["qb-core"]:GetCoreObject()

Citizen.CreateThread(function()
    if GetConvar("sv_environment", "") == "production" then
        return
    end

    -- Blip
    if not QBCore.Functions.GetBlip("job_pawl") then
        QBCore.Functions.CreateBlip("job_pawl", {
            name = Config.Blip.Name,
            coords = Config.Blip.Coords,
            sprite = Config.Blip.Sprite,
            scale = Config.Blip.Scale,
        })
    end
end)
