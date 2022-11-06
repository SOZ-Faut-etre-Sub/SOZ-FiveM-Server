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

Citizen.CreateThread(function()
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
            },
        },
        distance = 2.5,
    })

    -- Craft
    local craftOptions = {}
    for craftId, craft in pairs(Config.Craft) do
        craftOptions[#craftOptions + 1] = {
            color = "pawl",
            label = craft.Name,
            icon = ("c:pawl/craft-%s.png"):format(craftId),
            event = "pawl:client:craft",
            canInteract = function()
                return PlayerData.job.onduty
            end,
            identifier = craftId,
            job = "pawl",
            blackoutGlobal = true,
            blackoutJob = "pawl",
        }
    end

    exports["qb-target"]:RemoveZone("pawl:crafting")
    exports["qb-target"]:AddBoxZone("pawl:crafting", vector3(-533.23, 5293.28, 74.2), 1.8, 1.0,
                                    {name = "pawl:crafting", heading = 0, minZ = 73.2, maxZ = 76.0, debugPoly = false}, {
        options = craftOptions,
        distance = 2.5,
    })

    -- Target
    exports["qb-target"]:AddBoxZone("pawl:duty", vector3(-539.36, 5305.28, 76.37), 0.4, 1.2, {
        name = "pawl:duty",
        heading = 340,
        minZ = 76.12,
        maxZ = 76.77,
    }, {options = SozJobCore.Functions.GetDutyActions("pawl"), distance = 2.5})
end)

RegisterNetEvent("pawl:client:craft", function(data)
    local success, _ = exports["soz-utils"]:Progressbar("craft", "", Config.CraftDuration, false, true, {
        disableMovement = true,
        disableCombat = true,
    }, {animDict = "mp_arresting", anim = "a_uncuff", flags = 17}, {}, {})

    if success then
        TriggerServerEvent("pawl:server:craft", data.identifier)
    end
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
