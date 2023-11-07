local OnJob = false
local JobOutfit = false
local JobVehicle = false
local InVehicle = false
local ObjectifCoord = {}
local Counter = 0
local JobDone = nil
local harvestZone = nil
local hasEnteredZoneOnce = false
local PedCoord = {x = 479.17, y = -107.53, z = 63.16}

exports["qb-target"]:AddBoxZone("job metal", vector3(-343.2, -1554.44, 25.23), 1, 1,
                                {name = "job metal", minZ = 24.0, maxZ = 26.0, heading = 0, debugPoly = false}, {
    options = {
        {
            type = "client",
            event = "jobs:metal:end",
            icon = "c:pole/end.png",
            label = "Terminer",
            job = SozJobCore.JobType.Scrapper,
        },
    },
    distance = 2.5,
})

local function close()
    TriggerServerEvent("job:set:unemployed")
    DeleteVehicule(metal_vehicule)
    exports["qb-target"]:RemoveZone("metal_zone")
    destroyblip(job_blip)
    SetGpsMultiRouteRender(false)
    OnJob = false
    JobOutfit = false
    JobVehicle = false
    Counter = 0
    hasEnteredZoneOnce = false
    if harvestZone ~= nil then
        harvestZone:destroy()
        harvestZone = nil
    end
end

RegisterNetEvent("jobs:metal:end")
AddEventHandler("jobs:metal:end", function()
    if JobOutfit then
        QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
            disableMovement = true,
            disableCombat = true,
        }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
            TriggerServerEvent("soz-character:server:SetPlayerJobClothes", nil)
            close()
        end)
    else
        close()
    end
end)
