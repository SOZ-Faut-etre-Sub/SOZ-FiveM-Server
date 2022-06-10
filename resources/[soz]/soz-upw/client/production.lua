local function CreateEnergyZone(identifier, data)
    data.options = {
        {
            label = "Activer",
            type = "server",
            event = "soz-upw:server:TogglePlantActive",
            identifier = identifier,
            canInteract = function()
                return OnDuty() and not QBCore.Functions.TriggerRpc("soz-upw:server:GetPlantActive", identifier)
            end,
        },
        {
            label = "Désactiver",
            type = "server",
            event = "soz-upw:server:TogglePlantActive",
            identifier = identifier,
            canInteract = function()
                return OnDuty() and QBCore.Functions.TriggerRpc("soz-upw:server:GetPlantActive", identifier)
            end,
        },
        {
            label = "Récolter",
            event = "soz-upw:client:HarvestEnergy",
            identifier = identifier,
            canInteract = function()
                return OnDuty()
            end,
        },
        {
            label = "Pollution",
            action = function()
                local pollution = QBCore.Functions.TriggerRpc("soz-upw:server:GetPollutionPercent", true)
                exports["soz-hud"]:DrawNotification("Niveau de pollution : " .. pollution, "info")
            end,
            canInteract = function()
                return OnDuty()
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
local function HarvestPrecheck(identifier)
    local result = QBCore.Functions.TriggerRpc("soz-upw:server:PrecheckHarvest", identifier)

    -- success, reason
    return result[1], result[2]
end

local function Harvest(identifier)
    local success, elapsed = exports["soz-utils"]:Progressbar("soz-upw:progressbar:harvest", "Vous récoltez...", Config.Harvest.Duration, false, true,
                                                              {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "anim@mp_radio@garage@low", anim = "action_a"}, {}, {})

    if success then
        local harvested, reason = QBCore.Functions.TriggerRpc("soz-upw:server:Harvest", identifier)

        if not harvested then
            exports["soz-hud"]:DrawNotification("Il y a eu une erreur : " .. reason, "error")
        end

        return harvested
    end
end

local function HarvestEnergy(data)
    local isOk, reason = HarvestPrecheck(data.identifier)

    if isOk then
        local harvested = Harvest(data.identifier)

        if harvested then
            HarvestEnergy(data)
        end
    else
        exports["soz-hud"]:DrawNotification(reason, "error")
    end
end
AddEventHandler("soz-upw:client:HarvestEnergy", HarvestEnergy)
