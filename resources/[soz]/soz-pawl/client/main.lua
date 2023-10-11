QBCore = exports["qb-core"]:GetCoreObject()
SozJobCore = exports["soz-jobs"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()

FieldTrees = {}
DegradationLevel = Config.Degradation.Level.Green

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()

    -- Fields
    for identifier, _ in pairs(Config.Field.List) do
        local field = QBCore.Functions.TriggerRpc("pawl:server:getFieldData", identifier)
        TriggerEvent("pawl:client:syncField", identifier, field)
    end

    -- Degradation
    DegradationLevel = QBCore.Functions.TriggerRpc("pawl:server:getDegradationLevel")
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    -- Blip
    if not QBCore.Functions.GetBlip("job_pawl") then
        QBCore.Functions.CreateBlip("job_pawl", {
            name = Config.Blip.Name,
            coords = Config.Blip.Coords,
            sprite = Config.Blip.Sprite,
            scale = Config.Blip.Scale,
        })
    end

    -- Processing
    exports["qb-target"]:RemoveZone("pawl:processing:tree_trunk")
    exports["qb-target"]:AddBoxZone("pawl:processing:tree_trunk", vector3(-552.46, 5347.36, 74.74), 0.3, 0.8,
                                    {
        name = "pawl:processing:tree_trunk",
        heading = 70,
        minZ = 73.74,
        maxZ = 76.34,
        debugPoly = false,
    }, {
        options = {
            {
                type = "server",
                color = "pawl",
                label = "Démarrer production",
                icon = "c:pawl/start-prod.png",
                event = "pawl:server:startProcessingTree",
                canInteract = function()
                    local enabled = QBCore.Functions.TriggerRpc("pawl:server:processingTreeIsEnabled")
                    return not enabled and PlayerData.job.onduty
                end,
                job = "pawl",
                blackoutGlobal = true,
                blackoutJob = "pawl",
            },
            {
                type = "server",
                color = "pawl",
                label = "Arrêter production",
                icon = "c:pawl/stop-prod.png",
                event = "pawl:server:stopProcessingTree",
                canInteract = function()
                    local enabled = QBCore.Functions.TriggerRpc("pawl:server:processingTreeIsEnabled")
                    return enabled and PlayerData.job.onduty
                end,
                job = "pawl",
                blackoutGlobal = true,
                blackoutJob = "pawl",
            },
            {
                type = "server",
                color = "pawl",
                label = "État production",
                icon = "c:pawl/status-prod.png",
                event = "pawl:server:statusProcessingTree",
                canInteract = function()
                    return PlayerData.job.onduty
                end,
                job = "pawl",
                blackoutGlobal = true,
                blackoutJob = "pawl",
            },
        },
        distance = 2.5,
    })
end)

--- Degradation
RegisterNetEvent("pawl:client:OnDegradationLevelChanged", function(level)
    DegradationLevel = level
end)

AddEventHandler("populationPedCreating", function(_, _, _, model, _)
    if Config.Degradation.Peds[model] then
        local random = math.random(0, 100)
        if random > Config.Degradation.Multiplier[DegradationLevel] then
            CancelEvent()
        end
    end
end)
