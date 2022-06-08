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
