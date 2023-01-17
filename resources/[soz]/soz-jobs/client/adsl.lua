local payout_counter = 0
local OnJob = false
local JobOutfit = false
local JobVehicle = false
local InVehicle = false
local JobCounter = 0
local ObjectifCoord = {}
local DrawDistance = 100

exports["qb-target"]:AddBoxZone("job adsl", vector3(479.13, -107.45, 62.71), 1, 1, {
    name = "job adsl",
    heading = 0,
    debugPoly = false,
}, {
    options = {
        {
            type = "client",
            event = "jobs:adsl:begin",
            icon = "c:pole/start.png",
            label = "Job ADSL",
            blackoutGlobal = true,
            job = SozJobCore.JobType.Unemployed,
        },
        {
            type = "client",
            event = "jobs:adsl:tenue",
            icon = "c:pole/equip.png",
            label = "S'équiper",
            blackoutGlobal = true,
            job = SozJobCore.JobType.Adsl,
            canInteract = function()
                return JobOutfit == false
            end,
        },
        {
            type = "client",
            event = "jobs:adsl:vehicle",
            icon = "c:pole/vehicle.png",
            label = "Sortir",
            blackoutGlobal = true,
            job = SozJobCore.JobType.Adsl,
            canInteract = function()
                if JobOutfit == true then
                    return JobVehicle == false
                end
            end,
        },
        {
            type = "client",
            event = "jobs:adsl:restart",
            icon = "c:pole/restart.png",
            label = "Relancer",
            blackoutGlobal = true,
            job = SozJobCore.JobType.Adsl,
            canInteract = function()
                return OnJob == false
            end,
        },
        {
            type = "client",
            event = "jobs:adsl:end",
            icon = "c:pole/end.png",
            label = "Terminer",
            job = SozJobCore.JobType.Adsl,
        },
    },
    distance = 2.5,
})

RegisterNetEvent("jobs:adsl:fix")
AddEventHandler("jobs:adsl:fix", function()
    QBCore.Functions.Progressbar("adsl_fix", "Répare l'adsl..", 30000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {task = "WORLD_HUMAN_WELDING"}, {}, {}, function()
        exports["qb-target"]:RemoveZone("adsl_zone")
        destroyblip(job_blip)
        DrawInteractionMarker(ObjectifCoord, false)
        DrawDistance = 0
        payout_counter = payout_counter + 1
        JobCounter = JobCounter + 1
        if JobCounter >= 4 then
            OnJob = false
            TriggerServerEvent("job:anounce", "Retournez au point de départ pour continuer ou finir le job")
        else
            TriggerEvent("jobs:adsl:start")
        end
    end)
end)

local function SpawnVehicule()

end

RegisterNetEvent("jobs:adsl:begin")
AddEventHandler("jobs:adsl:begin", function()
    TriggerServerEvent("job:anounce", "Prenez la tenue")
    TriggerServerEvent("job:set:pole", SozJobCore.JobType.Adsl)
    OnJob = true
end)

RegisterNetEvent("jobs:adsl:tenue")
AddEventHandler("jobs:adsl:tenue", function()
    QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
        disableMovement = true,
        disableCombat = true,
    }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
        TriggerServerEvent("soz-character:server:SetPlayerJobClothes", SozJobCore.adsl_clothes[PlayerData.skin.Model.Hash])
        TriggerServerEvent("job:anounce", "Sortez le véhicule")
        JobOutfit = true
    end)
end)

RegisterNetEvent("jobs:adsl:vehicle")
AddEventHandler("jobs:adsl:vehicle", function()
    TriggerServerEvent("job:anounce", "Montez dans le véhicule de service")
    TriggerServerEvent("soz-core:server:vehicle:free-job-spawn", "utillitruck3",
                       {
        SozJobCore.adsl_vehicule.x,
        SozJobCore.adsl_vehicule.y,
        SozJobCore.adsl_vehicule.z,
        SozJobCore.adsl_vehicule.w,
    }, "jobs:adsl:vehicle-spawn")
end)

RegisterNetEvent("jobs:adsl:vehicle-spawn")
AddEventHandler("jobs:adsl:vehicle-spawn", function(vehicleNetId)
    adsl_vehicule = NetworkGetEntityFromNetworkId(vehicleNetId)

    JobVehicle = true
    createblip("Véhicule", "Montez dans le véhicule", 225, SozJobCore.adsl_vehicule)
    local player = PlayerPedId()
    while InVehicle == false do
        Citizen.Wait(100)
        if IsPedInVehicle(player, adsl_vehicule, true) == 1 then
            InVehicle = true
        end
    end
    destroyblip(job_blip)
    TriggerEvent("jobs:adsl:start")
end)

RegisterNetEvent("jobs:adsl:restart")
AddEventHandler("jobs:adsl:restart", function()
    JobCounter = 0
    TriggerEvent("jobs:adsl:start")
end)

local function random_coord()
    local result = SozJobCore.adsl[math.random(#SozJobCore.adsl)]
    if result.x == JobDone then
        random_coord()
    end
    local JobDone = result.x
    return result
end

RegisterNetEvent("jobs:adsl:start")
AddEventHandler("jobs:adsl:start", function()
    if JobCounter == 0 then
        TriggerServerEvent("job:anounce", "Réparez le boitier adsl")
    else
        TriggerServerEvent("job:anounce", "Réparez le prochain boitier adsl")
    end
    local coords = random_coord()
    createblip("ADSL", "Réparer l'adsl", 761, coords)
    SetNewWaypoint(coords.x, coords.y)
    exports["qb-target"]:AddBoxZone("adsl_zone", vector3(coords.x, coords.y, coords.z), coords.sx, coords.sy,
                                    {
        name = "adsl_zone",
        heading = coords.heading,
        minZ = coords.minZ,
        maxZ = coords.maxZ,
        debugPoly = false,
    }, {
        options = {{type = "client", event = "jobs:adsl:fix", icon = "c:pole/repair.png", label = "Réparer"}},
        distance = 1.5,
    })
    ObjectifCoord = coords
    DrawDistance = 100
    while DrawDistance >= 50 do
        Citizen.Wait(1000)
        local player = PlayerPedId()
        local CoordPlayer = GetEntityCoords(player)
        DrawDistance = GetDistanceBetweenCoords(CoordPlayer.x, CoordPlayer.y, CoordPlayer.z, ObjectifCoord.x, ObjectifCoord.y, ObjectifCoord.z)
    end
    DrawInteractionMarker(ObjectifCoord, true)
end)

local function close()
    TriggerServerEvent("job:set:unemployed")
    local money = SozJobCore.adsl_payout * payout_counter
    TriggerServerEvent("job:payout", money)
    QBCore.Functions.DeleteVehicle(adsl_vehicule)
    exports["qb-target"]:RemoveZone("adsl_zone")
    destroyblip(job_blip)
    OnJob = false
    JobOutfit = false
    JobVehicle = false
    JobCounter = 0
    payout_counter = 0
    DrawDistance = 0
end

RegisterNetEvent("jobs:adsl:end")
AddEventHandler("jobs:adsl:end", function()
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
