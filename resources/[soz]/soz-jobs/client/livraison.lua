local payout_counter = 0
local OnJob = false
local JobOutfit = false
local JobVehicle = false
local InVehicle = false
local JobCounter = 0
local ObjectifCoord = {}
local DrawDistance = 100

exports["qb-target"]:AddBoxZone("job livraison", vector3(-424.18, -2789.71, 6.0), 1, 1, {
    name = "job livraison",
    heading = 0,
    debugPoly = false,
}, {
    options = {
        {
            type = "client",
            event = "jobs:livraison:begin",
            icon = "c:pole/start.png",
            label = "Job Livraison",
            job = SozJobCore.JobType.Unemployed,
            blackoutGlobal = true,
        },
        {
            type = "client",
            event = "jobs:livraison:tenue",
            icon = "c:pole/equip.png",
            label = "S'équiper",
            job = SozJobCore.JobType.Delivery,
            blackoutGlobal = true,
            canInteract = function()
                return JobOutfit == false
            end,
        },
        {
            type = "client",
            event = "jobs:livraison:vehicle",
            icon = "c:pole/vehicle.png",
            label = "Sortir",
            job = SozJobCore.JobType.Delivery,
            blackoutGlobal = true,
            canInteract = function()
                if JobOutfit == true then
                    return JobVehicle == false
                end
            end,
        },
        {
            type = "client",
            event = "jobs:livraison:restart",
            icon = "c:pole/restart.png",
            label = "Relancer",
            job = SozJobCore.JobType.Delivery,
            blackoutGlobal = true,
            canInteract = function()
                return OnJob == false
            end,
        },
        {
            type = "client",
            event = "jobs:livraison:end",
            icon = "c:pole/end.png",
            label = "Terminer",
            job = SozJobCore.JobType.Delivery,
            blackoutGlobal = true,
        },
    },
    distance = 2.5,
})

RegisterNetEvent("jobs:livraison:fix")
AddEventHandler("jobs:livraison:fix", function()
    QBCore.Functions.Progressbar("livraison_fix", "Livraison de fougère..", 30000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "mp_common", anim = "givetake2_a"}, {}, {}, function()
        exports["qb-target"]:RemoveZone("livraison_zone")
        destroyblip(job_blip)
        DrawInteractionMarker(ObjectifCoord, false)
        DrawDistance = 0
        payout_counter = payout_counter + 1
        JobCounter = JobCounter + 1
        if JobCounter >= 4 then
            OnJob = false
            TriggerServerEvent("job:anounce", "Retournez au point de départ pour continuer ou finir le job")
        else
            TriggerEvent("jobs:livraison:start")
        end
    end)
end)

RegisterNetEvent("jobs:livraison:begin")
AddEventHandler("jobs:livraison:begin", function()
    TriggerServerEvent("job:anounce", "Prenez la tenue")
    TriggerServerEvent("job:set:pole", SozJobCore.JobType.Delivery)
    OnJob = true
end)

RegisterNetEvent("jobs:livraison:tenue")
AddEventHandler("jobs:livraison:tenue", function()
    TriggerServerEvent("job:anounce", "Sortez le véhicule de service")
    JobOutfit = true
end)

RegisterNetEvent("jobs:livraison:vehicle")
AddEventHandler("jobs:livraison:vehicle", function()
    TriggerServerEvent("job:anounce", "Enfourchez votre scooter de service")
    TriggerServerEvent("soz-core:server:vehicle:free-job-spawn", "faggio3", {
        SozJobCore.livraison_vehicule.x,
        SozJobCore.livraison_vehicule.y,
        SozJobCore.livraison_vehicule.z,
        SozJobCore.livraison_vehicule.w,
    }, "jobs:livraison:vehicle-spawn")
end)

RegisterNetEvent("jobs:livraison:vehicle-spawn")
AddEventHandler("jobs:livraison:vehicle-spawn", function(vehicleNetId)
    livraison_vehicule = NetworkGetEntityFromNetworkId(vehicleNetId)
    JobVehicle = true
    createblip("Véhicule", "Scooter de sevrice", 225, SozJobCore.livraison_vehicule)
    local player = GetPlayerPed(-1)
    while InVehicle == false do
        Citizen.Wait(100)
        if IsPedInVehicle(player, livraison_vehicule, true) == 1 then
            InVehicle = true
        end
    end
    destroyblip(job_blip)
    TriggerEvent("jobs:livraison:start")
end)

RegisterNetEvent("jobs:livraison:restart")
AddEventHandler("jobs:livraison:restart", function()
    JobCounter = 0
    TriggerEvent("jobs:livraison:start")
end)

local function random_coord()
    local result = SozJobCore.livraison[math.random(#SozJobCore.livraison)]
    if result.x == JobDone then
        random_coord()
    end
    local JobDone = result.x
    return result
end

RegisterNetEvent("jobs:livraison:start")
AddEventHandler("jobs:livraison:start", function()
    if JobCounter == 0 then
        TriggerServerEvent("job:anounce", "Livrez la fougère")
    else
        TriggerServerEvent("job:anounce", "Livrez la prochaine fougère")
    end
    local coords = random_coord()
    createblip("livraison", "Livraison", 761, coords)
    SetNewWaypoint(coords.x, coords.y)
    exports["qb-target"]:AddBoxZone("livraison_zone", vector3(coords.x, coords.y, coords.z), coords.sx, coords.sy,
                                    {
        name = "livraison_zone",
        heading = coords.heading,
        minZ = coords.minZ,
        maxZ = coords.maxZ,
        debugPoly = false,
    }, {
        options = {
            {type = "client", event = "jobs:livraison:fix", icon = "c:pole/livrer.png", label = "Livrez la fougère"},
        },
        distance = 1.5,
    })
    ObjectifCoord = coords
    DrawDistance = 100
    while DrawDistance >= 50 do
        Citizen.Wait(1000)
        local player = GetPlayerPed(-1)
        local CoordPlayer = GetEntityCoords(player)
        DrawDistance = GetDistanceBetweenCoords(CoordPlayer.x, CoordPlayer.y, CoordPlayer.z, ObjectifCoord.x, ObjectifCoord.y, ObjectifCoord.z)
    end
    DrawInteractionMarker(ObjectifCoord, true)
end)

RegisterNetEvent("jobs:livraison:end")
AddEventHandler("jobs:livraison:end", function()
    TriggerServerEvent("job:set:unemployed")
    local money = SozJobCore.livraison_payout * payout_counter
    TriggerServerEvent("job:payout", money)
    QBCore.Functions.DeleteVehicle(livraison_vehicule)
    exports["qb-target"]:RemoveZone("livraison_zone")
    destroyblip(job_blip)
    OnJob = false
    JobOutfit = false
    JobVehicle = false
    JobCounter = 0
    payout_counter = 0
    DrawDistance = 0
end)
