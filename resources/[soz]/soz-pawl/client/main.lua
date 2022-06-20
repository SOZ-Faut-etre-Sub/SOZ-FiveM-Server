QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()
FieldTrees = {}
FieldHarvest = {}

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

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

    -- Fields
    for identifier, _ in pairs(Config.Fields) do
        local field = QBCore.Functions.TriggerRpc("pawl:server:getFieldData", identifier)
        TriggerEvent("pawl:client:syncField", identifier, field)
    end

    -- Processing
    exports["qb-target"]:RemoveZone("pawl:processing:tree_trunk")
    exports["qb-target"]:AddBoxZone("pawl:processing:tree_trunk", vector3(-552.14, 5347.94, 74.74), 0.5, 2.2,
                                    {
        name = "pawl:processing:tree_trunk",
        heading = 72,
        minZ = 73.74,
        maxZ = 76.54,
        debugPoly = true,
    }, {
        options = {
            {
                type = "server",
                label = "Transformer",
                icon = "c:inventory/ouvrir_le_stockage.png",
                event = "pawl:server:processingTree",
            },
        },
        distance = 2.5,
    })
end)
