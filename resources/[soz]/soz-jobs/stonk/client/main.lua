QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()

-- In-memory, player-based save
CollectedShops = {}

Citizen.CreateThread(function()
    -- BLIP
    QBCore.Functions.CreateBlip("stonk-dep", {
        name = StonkConfig.Blip.Name,
        coords = StonkConfig.Blip.Coords,
        sprite = StonkConfig.Blip.Icon,
        color = StonkConfig.Blip.Color,
        scale = StonkConfig.Blip.Scale,
    })

    -- DUTY
    exports["qb-target"]:AddBoxZone("stonk:duty", vector2(-18.74, -707.44), 0.2, 0.5, {
        heading = 200.0,
        minZ = 45.9,
        maxZ = 46.45,
    }, {
        options = {
            {
                icon = "fas fa-sign-in-alt",
                label = "Prise de service",
                type = "server",
                event = "QBCore:ToggleDuty",
                canInteract = function()
                    return not PlayerData.job.onduty
                end,
            },
            {
                icon = "fas fa-sign-out-alt",
                label = "Fin de service",
                type = "server",
                event = "QBCore:ToggleDuty",
                canInteract = function()
                    return PlayerData.job.onduty
                end,
            },
        },
    })
end)
