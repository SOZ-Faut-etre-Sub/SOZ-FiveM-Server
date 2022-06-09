QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()
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
end)

function CreateZone(identifier, zoneType, data)
    local zoneName = string.format("%s_%s", identifier, zoneType)

    exports["qb-target"]:AddBoxZone(zoneName, data.coords, data.sx, data.sy, {
        heading = data.heading,
        minZ = data.minZ,
        maxZ = data.maxZ,
        debugPoly = true,
    }, {options = data.options})
end

--
-- UTILS
--
function OnDuty()
    return PlayerData.job.id == "upw" and PlayerData.job.duty
end
