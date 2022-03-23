QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()

-- In-memory, player-based save
CollectedShops = {}

Citizen.CreateThread(function()
    QBCore.Functions.CreateBlip("stonk-dep", {
        name = StonkConfig.Blip.Name,
        coords = StonkConfig.Blip.Coords,
        sprite = StonkConfig.Blip.Icon,
        color = StonkConfig.Blip.Color,
        scale = StonkConfig.Blip.Scale,
    })
end)
