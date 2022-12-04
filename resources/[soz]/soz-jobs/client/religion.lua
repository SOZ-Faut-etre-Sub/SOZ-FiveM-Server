local payout_counter = 0
local OnJob = false
local JobOutfit = false
local JobVehicle = false
local InVehicle = false
local ObjectifCoord = {}
local DrawDistance = 100
local PrayersMax = 0
local PrayersCount = 0
local PrayersPed = {}

local function ResetPrayersState()
    PrayersMax = 0
    PrayersCount = 0
    PrayersPed = {}
end

exports["qb-target"]:AddBoxZone("job religion", vector3(-766.24, -24.34, 41.07), 1, 1, {
    name = "job religion",
    heading = 0,
    debugPoly = false,
}, {
    options = {
        {
            type = "client",
            event = "jobs:religion:begin",
            icon = "c:pole/start.png",
            label = "Job InfoChat",
            job = SozJobCore.JobType.Unemployed,
            blackoutGlobal = true,
        },
        {
            type = "client",
            event = "jobs:religion:tenue",
            icon = "c:pole/equip.png",
            label = "S'équiper",
            job = SozJobCore.JobType.Religious,
            blackoutGlobal = true,
            canInteract = function()
                return JobOutfit == false
            end,
        },
        {
            type = "client",
            event = "jobs:religion:vehicle",
            icon = "c:pole/vehicle.png",
            label = "Sortir",
            job = SozJobCore.JobType.Religious,
            blackoutGlobal = true,
            canInteract = function()
                if JobOutfit == true then
                    return JobVehicle == false
                end
            end,
        },
        {
            type = "client",
            event = "jobs:religion:restart",
            icon = "c:pole/restart.png",
            label = "Relancer",
            job = SozJobCore.JobType.Religious,
            blackoutGlobal = true,
            canInteract = function()
                return OnJob == false
            end,
        },
        {
            type = "client",
            event = "jobs:religion:end",
            icon = "c:pole/end.png",
            label = "Terminer",
            job = SozJobCore.JobType.Religious,
        },
    },
    distance = 2.5,
})

RegisterNetEvent("jobs:religion:fix")
AddEventHandler("jobs:religion:fix", function(ped)
    for _, p in ipairs(PrayersPed) do
        if p == ped then
            exports["soz-hud"]:DrawNotification("Vous avez déjà parlé à cette personne", "warning")
            return
        end
    end
    FreezeEntityPosition(ped, true)
    QBCore.Functions.Progressbar("religion_fix", "Vous balancez une info chat...", 10000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "timetable@amanda@ig_4", anim = "ig_4_base"}, {}, {}, function()
        payout_counter = payout_counter + 1
        PrayersCount = PrayersCount + 1
        table.insert(PrayersPed, ped)
        FreezeEntityPosition(ped, false)
        if PrayersCount >= PrayersMax then
            exports["soz-hud"]:DrawNotification(string.format("Vous avez prêché %d infos chat dans cette zone", PrayersCount), "warning")
            exports["soz-hud"]:DrawNotification("Retournez voir le prêtre", "info")
            exports["qb-target"]:RemoveZone("religion_zone")
            destroyblip(job_blip)
            OnJob = false
            ResetPrayersState()
        end
    end)
end)

RegisterNetEvent("jobs:religion:begin")
AddEventHandler("jobs:religion:begin", function()
    TriggerServerEvent("job:anounce", "Prenez la tenue")
    TriggerServerEvent("job:set:pole", SozJobCore.JobType.Religious)
    OnJob = true
end)

RegisterNetEvent("jobs:religion:tenue")
AddEventHandler("jobs:religion:tenue", function()
    TriggerServerEvent("job:anounce", "Sortez le véhicule de service")
    JobOutfit = true
end)

RegisterNetEvent("jobs:religion:vehicle")
AddEventHandler("jobs:religion:vehicle", function()
    TriggerServerEvent("job:anounce", "Enfourchez votre vélo de service")
    TriggerServerEvent("soz-core:server:vehicle:free-job-spawn", "fixter", {
        SozJobCore.religion_vehicule.x,
        SozJobCore.religion_vehicule.y,
        SozJobCore.religion_vehicule.z,
        SozJobCore.religion_vehicule.w,
    }, "jobs:religion:vehicle-spawn")
end)

RegisterNetEvent("jobs:religion:vehicle-spawn")
AddEventHandler("jobs:religion:vehicle-spawn", function()
    JobVehicle = true
    createblip("Véhicule", "Vélo de service", 225, SozJobCore.religion_vehicule)
    local player = GetPlayerPed(-1)
    while InVehicle == false do
        Citizen.Wait(100)
        if IsPedInVehicle(player, religion_vehicule, true) == 1 then
            InVehicle = true
        end
    end
    destroyblip(job_blip)
    TriggerEvent("jobs:religion:start")
end)

RegisterNetEvent("jobs:religion:restart")
AddEventHandler("jobs:religion:restart", function()
    JobCounter = 0
    TriggerEvent("jobs:religion:start")
end)

local function random_coord()
    local result = SozJobCore.religion[math.random(#SozJobCore.religion)]
    if result.x == JobDone then
        random_coord()
    end
    local JobDone = result.x
    return result
end

RegisterNetEvent("jobs:religion:start")
AddEventHandler("jobs:religion:start", function()
    TriggerServerEvent("job:anounce", "Rendez vous dans la zone pour diffuser vos infos chat")
    local coords = random_coord()
    createblip("religion", "Zone Info Chat", 480, coords)
    SetNewWaypoint(coords.x, coords.y)
    ResetPrayersState()
    PrayersMax = math.random(SozJobCore.religion_prayers_range.min, SozJobCore.religion_prayers_range.max)
    exports["qb-target"]:AddBoxZone("religion_zone", vector3(coords.x, coords.y, coords.z), coords.sx, coords.sy,
                                    {
        name = "religion_zone",
        heading = coords.heading,
        minZ = coords.minZ,
        maxZ = coords.maxZ,
        debugPoly = false,
    }, {
        options = {
            {
                type = "client",
                icon = "fas fa-sign-in-alt",
                label = "Donner une info chat",
                canInteract = function(entity)
                    local type = GetEntityType(entity)
                    if type == 1 then
                        return true
                    else
                        return false
                    end
                end,
                action = function(entity)
                    TriggerEvent("jobs:religion:fix", entity)
                end,
            },
        },
        distance = 2.5,
    })
    ObjectifCoord = coords
    DrawDistance = 100
    while DrawDistance >= 50 do
        Citizen.Wait(1000)
        local player = GetPlayerPed(-1)
        local CoordPlayer = GetEntityCoords(player)
        DrawDistance = GetDistanceBetweenCoords(CoordPlayer.x, CoordPlayer.y, CoordPlayer.z, ObjectifCoord.x, ObjectifCoord.y, ObjectifCoord.z)
    end
    TriggerServerEvent("job:anounce", "Balancez vos infos chat aux passants")
end)

RegisterNetEvent("jobs:religion:end")
AddEventHandler("jobs:religion:end", function()
    TriggerServerEvent("job:set:unemployed")
    local money = SozJobCore.religion_payout * payout_counter
    TriggerServerEvent("job:payout", money)
    QBCore.Functions.DeleteVehicle(religion_vehicule)
    exports["qb-target"]:RemoveZone("adsl_zone")
    destroyblip(job_blip)
    if IsWaypointActive() then
        DeleteWaypoint()
    end
    OnJob = false
    JobOutfit = false
    JobVehicle = false
    payout_counter = 0
    ResetPrayersState()
end)
