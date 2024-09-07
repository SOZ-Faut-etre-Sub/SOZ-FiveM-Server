QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()

FieldTrees = {}
DegradationLevel = Config.Degradation.Level.Green

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()

    -- Fields
    for identifier, _ in pairs(Config.Field.List) do
        TriggerServerEvent("pawl:server:getFieldData", identifier)
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
    exports["soz-core"]:RemoveZone("pawl:processing:tree_trunk")
    exports["soz-core"]:AddBoxZone("pawl:processing:tree_trunk", {
        center = {-552.46, 5347.36, 74.74},
        length = 0.3,
        width = 0.8,
        name = "pawl:processing:tree_trunk",
        heading = 70,
        minZ = 73.74,
        maxZ = 76.34,
    }, {
        {
            color = "pawl",
            label = "Démarrer production",
            icon = "c:pawl/start-prod",
            canInteract = function()
                local enabled = QBCore.Functions.TriggerRpc("pawl:server:processingTreeIsEnabled")
                return not enabled
            end,
            action = function()
                TriggerServerEvent("pawl:server:startProcessingTree")
            end,
            job = "pawl",
            blackoutGlobal = true,
            blackoutJob = "pawl",
        },
        {
            color = "pawl",
            label = "Arrêter production",
            icon = "c:pawl/stop-prod",
            canInteract = function()
                local enabled = QBCore.Functions.TriggerRpc("pawl:server:processingTreeIsEnabled")
                return enabled
            end,
            action = function()
                TriggerServerEvent("pawl:server:stopProcessingTree")
            end,
            job = "pawl",
            blackoutGlobal = true,
            blackoutJob = "pawl",
        },
        {
            color = "pawl",
            label = "État production",
            icon = "c:pawl/status-prod",
            action = function()
                TriggerServerEvent("pawl:server:statusProcessingTree")
            end,
            job = "pawl",
            blackoutGlobal = true,
            blackoutJob = "pawl",
        },
    }, 2.5)
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
