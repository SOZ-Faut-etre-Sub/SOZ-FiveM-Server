function CreateEnergyZone(identifier, data)
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
            label = "Collecter l'énergie",
            event = "soz-upw:client:HarvestLoop",
            identifier = identifier,
            harvest = "energy",
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

function CreateWasteZone(identifier, data)
    data.options = {
        {
            label = "Collecter les déchets",
            event = "soz-upw:client:HarvestLoop",
            identifier = identifier,
            harvest = "waste",
            canInteract = function()
                return OnDuty()
            end,
        },
    }

    return CreateZone(identifier, "waste", data)
end

--
-- FARM
--
local function HarvestPrecheck(identifier, harvest)
    local result = QBCore.Functions.TriggerRpc("soz-upw:server:PrecheckHarvest", identifier, harvest)

    -- success, reason
    return result[1], result[2]
end

local function Harvest(identifier, harvest)
    local message = "Vous collectez..."
    if harvest == "inverter-in" or harvest == "terminal-in" then
        message = "Vous déposez..."
    end

    local success, elapsed = exports["soz-utils"]:Progressbar("soz-upw:progressbar:harvest", message, Config.Harvest.Duration, false, true,
                                                              {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "anim@mp_radio@garage@low", anim = "action_a"}, {}, {})

    if success then
        local result = QBCore.Functions.TriggerRpc("soz-upw:server:Harvest", identifier, harvest)
        local harvested, message = table.unpack(result)

        if harvested then
            exports["soz-hud"]:DrawNotification(message, "success")
        else
            exports["soz-hud"]:DrawNotification("Il y a eu une erreur : " .. message, "error")
        end

        return harvested
    end
end

local function HarvestLoop(data)
    local isOk, reason = HarvestPrecheck(data.identifier, data.harvest)

    if isOk then
        local harvested = Harvest(data.identifier, data.harvest)

        if harvested then
            HarvestLoop(data)
        end
    else
        exports["soz-hud"]:DrawNotification(reason, "error")
    end
end
AddEventHandler("soz-upw:client:HarvestLoop", HarvestLoop)
