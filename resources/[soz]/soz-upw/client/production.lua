local function CreateEnergyZone(identifier, data)
    data.options = {
        {
            label = "Activer",
            type = "server",
            event = "soz-upw:server:TooglePlantActive",
            canInteract = function()
                return not QBCore.Functions.TriggerRpc("soz-upw:server:GetPlantActive", identifier)
            end,
        },
        {
            label = "Désactiver",
            type = "server",
            event = "soz-upw:server:TooglePlantActive",
            canInteract = function()
                return QBCore.Functions.TriggerRpc("soz-upw:server:GetPlantActive", identifier)
            end,
        },
        {
            label = "Récolter",
            event = "soz-upw:client:HarvestEnergy",
            identifier = identifier,
            canInteract = function()
                return QBCore.Functions.TriggerRpc("soz-upw:server:GetPlantActive", identifier)
            end,
        },
        {
            label = "Pollution",
            action = function()
                local pollution = QBCore.Functions.TriggerRpc("soz-upw:server:GetPollutionPercent", true)
                exports["soz-hud"]:DrawNotification("Niveau de pollution : " .. pollution, "info")
            end,
        },
    }

    return CreateZone(identifier, "energy", data)
end

local function CreateWasteZone(identifier, data)
    data.options = {}

    return CreateZone(identifier, "waste", data)
end

Citizen.CreateThread(function()
    for identifier, plantData in pairs(Config.Plants) do
        for key, data in pairs(plantData.client) do
            if key == "energyZone" then
                CreateEnergyZone(identifier, data)
            end

            if key == "wasteZone" then
                CreateWasteZone(identifier, data)
            end
        end
    end
end)

--
-- FARM
--
local function Harvest(identifier)
    local success, elapsed = exports["soz-utils"]:Progressbar("soz-upw:progressbar:harvest", "Vous récoltez...", Config.Harvest.Duration, false, true,
                                                              {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "anim@mp_radio@garage@low", anim = "action_a"}, {}, {})

    if success then
        QBConfig.Functions.TriggerServerEvent("soz-upw:server:Harvest", identifier)
    end
end

AddEventHandler("soz-upw:client:HarvestEnergy", function(data)
    local isOk, reason = QBCore.Functions.TriggerRpc("soz-upw:server:PrecheckHarvest", data.identifier)

    if isOk then
        Harvest(data.identifier)
    else
        exports["soz-hud"]:DrawNotification(reason, "error")
    end
end)
