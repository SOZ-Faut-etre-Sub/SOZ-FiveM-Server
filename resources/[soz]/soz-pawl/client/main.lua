QBCore = exports["qb-core"]:GetCoreObject()
SozJobCore = exports["soz-jobs"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()

FieldTrees = {}
FieldHarvest = {}
DegradationLevel = Config.Degradation.Level.Green

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
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

    if GetConvar("feature_dlc1_pawl", "0") == "0" then
        return
    end

    -- Fields
    for identifier, _ in pairs(Config.Fields) do
        local field = QBCore.Functions.TriggerRpc("pawl:server:getFieldData", identifier)
        TriggerEvent("pawl:client:syncField", identifier, field)
    end

    -- Degradation
    DegradationLevel = QBCore.Functions.TriggerRpc("pawl:server:getDegradationLevel")

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
                icon = "c:inventory/ouvrir_le_stockage.png",
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
                icon = "c:inventory/ouvrir_le_stockage.png",
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
                icon = "c:inventory/ouvrir_le_stockage.png",
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
            icon = "c:inventory/ouvrir_le_stockage.png",
            event = "pawl:client:craft",
            canInteract = function()
                return PlayerData.job.onduty
            end,
            identifier = craftId,
            job = "pawl",
        }
    end

    exports["qb-target"]:RemoveZone("pawl:crafting")
    exports["qb-target"]:AddBoxZone("pawl:crafting", vector3(-533.23, 5293.28, 74.2), 1.8, 1.0,
                                    {name = "pawl:crafting", heading = 0, minZ = 73.2, maxZ = 76.0, debugPoly = false}, {
        options = craftOptions,
        distance = 2.5,
    })

    -- Target
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Facturer",
                color = "pawl",
                icon = "c:jobs/facture.png",
                event = "jobs:client:InvoicePlayer",
                job = "pawl",
            },
            {
                label = "Facturer la société",
                color = "pawl",
                icon = "c:jobs/facture.png",
                event = "jobs:client:InvoiceSociety",
                canInteract = function()
                    return SozJobCore.Functions.HasPermission("pawl", SozJobCore.JobPermission.SocietyBankInvoices)
                end,
                job = "pawl",
            },
        },
        distance = 1.5,
    })

    exports["qb-target"]:AddBoxZone("pawl:duty", vector3(-539.36, 5305.28, 76.37), 0.4, 1.2, {
        name = "pawl:duty",
        heading = 340,
        minZ = 76.12,
        maxZ = 76.77,
    }, {options = SozJobCore.Functions.GetDutyActions("pawl"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("pawl:bossShop", vector3(-538.07, 5304.91, 76.37), 0.55, 0.65,
                                    {name = "pawl:bossShop", heading = 340, minZ = 75.37, maxZ = 77.37}, {
        options = {
            {
                label = "Récupérer du matériel",
                icon = "fas fa-briefcase",
                action = function()
                    TriggerEvent("jobs:client:bossShop", "PawlConfig")
                end,
                canInteract = function()
                    return SozJobCore.Functions.HasPermission("pawl", SozJobCore.JobPermission.SocietyShop)
                end,
                job = "pawl",
            },
        },
        distance = 2.5,
    })

    exports["qb-target"]:AddBoxZone("pawl:cloakroom1", vector3(-532.21, 5308.37, 76.37), 0.6, 7.2,
                                    {name = "pawl:cloakroom1", heading = 250, minZ = 75.37, maxZ = 78.37}, {
        options = {
            {label = "S'habiller", icon = "c:jobs/habiller.png", event = "pawl:client:OpenCloakroomMenu", job = "pawl"},
        },
        distance = 2.5,
    })
    exports["qb-target"]:AddBoxZone("pawl:cloakroom2", vector3(-541.12, 5311.85, 76.37), 0.6, 7.2,
                                    {name = "pawl:cloakroom2", heading = 70, minZ = 75.37, maxZ = 78.37}, {
        options = {
            {label = "S'habiller", icon = "c:jobs/habiller.png", event = "pawl:client:OpenCloakroomMenu", job = "pawl"},
        },
        distance = 2.5,
    })
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
    if GetConvar("feature_dlc1_pawl", "0") == "0" then
        return
    end

    if Config.Degradation.Peds[model] then
        local random = math.random(0, 100)
        if random >= Config.Degradation.Multiplier[DegradationLevel] then
            CancelEvent()
        end
    end
end)
