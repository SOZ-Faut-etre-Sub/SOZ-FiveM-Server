QBCore = exports["qb-core"]:GetCoreObject()
SozCoreJobs = exports["soz-jobs"]:GetCoreObject()

Citizen.CreateThread(function()
    -- Blip
    if not QBCore.Functions.GetBlip("job_upw") then
        QBCore.Functions.CreateBlip("job_upw", {
            name = Config.Blip.Name,
            coords = Config.Blip.Coords,
            sprite = Config.Blip.Sprite,
        })
    end

    -- Energy Plants
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

    local facilities = {
        {arr = Config.Inverters, create = CreateInverterZone},
        {arr = Config.Terminals, create = CreateTerminalZone},
    }
    for _, conf in ipairs(facilities) do
        for identifier, data in pairs(conf.arr) do
            conf.create(identifier, data.zone)
        end
    end
end)

function CreateZone(identifier, zoneType, data)
    local zoneName = string.format("%s_%s", identifier, zoneType)

    exports["qb-target"]:AddBoxZone(zoneName, data.coords, data.sx, data.sy, {
        heading = data.heading,
        minZ = data.minZ,
        maxZ = data.maxZ,
        debugPoly = false,
    }, {options = data.options})
end

--
-- UTILS
--
function OnDuty()
    local PlayerData = QBCore.Functions.GetPlayerData()
    return PlayerData.job.id == "upw" and PlayerData.job.onduty
end
