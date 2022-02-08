local QBCore = exports["qb-core"]:GetCoreObject()
local payout_counter = 0
local OnJob = false
local JobOutfit = false
local JobVehicle = false
local InVehicle = false
local JobCounter = 0
local ObjectifCoord = {}
local DrawDistance = 100
local PedCoord = {x = 479.17, y = -107.53, z = 63.16}

exports["qb-target"]:AddBoxZone("job metal", vector3(-343.2, -1554.44, 25.23), 1, 1, {
    name = "job metal",
    heading = 0,
    debugPoly = false,
}, {
    options = {
        {
            type = "client",
            event = "jobs:metal:begin",
            icon = "fas fa-sign-in-alt",
            label = "Commencer le job metal",
            job = "unemployed",
        },
        {
            type = "client",
            event = "jobs:metal:tenue",
            icon = "fas fa-sign-in-alt",
            label = "Prendre la tenue",
            job = "metal",
            canInteract = function()
                return JobOutfit == false
            end,
        },
        {
            type = "client",
            event = "jobs:metal:vehicle",
            icon = "fas fa-sign-in-alt",
            label = "Sortir la voiture",
            job = "metal",
            canInteract = function()
                if JobOutfit == true then
                    return JobVehicle == false
                end
            end,
        },
        {
            type = "client",
            event = "jobs:metal:restart",
            icon = "fas fa-sign-in-alt",
            label = "Continuer le job metal",
            job = "metal",
            canInteract = function()
                return OnJob == false
            end,
        },
        {
            type = "client",
            event = "jobs:metal:end",
            icon = "fas fa-sign-in-alt",
            label = "Finir le job metal",
            job = "metal",
        },
    },
    distance = 2.5,
})

RegisterNetEvent("jobs:metal:fix")
AddEventHandler("jobs:metal:fix", function()
    TriggerEvent("animations:client:EmoteCommandStart", {"weld"})
    QBCore.Functions.Progressbar("adsl_fix", "Répare l'metal..", 30000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {}, {}, {}, function()
        TriggerEvent("animations:client:EmoteCommandStart", {"c"})
        exports["qb-target"]:RemoveZone("adsl_zone")
        destroyblip(job_blip)
        DrawInteractionMarker(ObjectifCoord, false)
        DrawDistance = 0
        payout_counter = payout_counter + 1
        JobCounter = JobCounter + 1
        ClearGpsMultiRoute()
        if JobCounter >= 4 then
            OnJob = false
            TriggerServerEvent("job:anounce", "Retournez au point de départ pour continuer ou finir le job")
        else
            TriggerEvent("jobs:metal:start")
        end
    end)
end)

local function SpawnVehicule()
    local ModelHash = "scrap"
    local model = GetHashKey(ModelHash)
    if not IsModelInCdimage(model) then
        return
    end
    RequestModel(model)
    print("model load")
    while not HasModelLoaded(model) do
        Citizen.Wait(10)
        print(test)
    end
    metal_vehicule = CreateVehicle(model, Config.metal_vehicule.x, Config.metal_vehicule.y, Config.metal_vehicule.z, Config.metal_vehicule.w, true, false)
    SetModelAsNoLongerNeeded(model)
end

RegisterNetEvent("jobs:metal:begin")
AddEventHandler("jobs:metal:begin", function()
    TriggerServerEvent("job:anounce", "Prenez la tenue")
    TriggerServerEvent("job:set:pole", "metal")
    OnJob = true
end)

RegisterNetEvent("jobs:metal:tenue")
AddEventHandler("jobs:metal:tenue", function()
    TriggerServerEvent("job:anounce", "Sortez le véhicule")
    JobOutfit = true
end)

RegisterNetEvent("jobs:metal:vehicle")
AddEventHandler("jobs:metal:vehicle", function()
    TriggerServerEvent("job:anounce", "Montez dans le véhicule de service")
    SpawnVehicule()
    JobVehicle = true
    createblip("Véhicule", "Montez dans le véhicule", 225, Config.metal_vehicule)
    local player = GetPlayerPed(-1)
    while InVehicle == false do
        Citizen.Wait(100)
        if IsPedInVehicle(player, metal_vehicule, true) == 1 then
            InVehicle = true
        end
    end
    destroyblip(job_blip)
    TriggerEvent("jobs:metal:start")
end)

RegisterNetEvent("jobs:metal:restart")
AddEventHandler("jobs:metal:restart", function()
    JobCounter = 0
    TriggerEvent("jobs:metal:start")
end)

local function random_coord()
    local result = Config.metal[math.random(#Config.metal)]
    if result.x == JobDone then
        random_coord()
    end
    local JobDone = result.x
    return result
end

RegisterNetEvent("jobs:metal:start")
AddEventHandler("jobs:metal:start", function()
    if JobCounter == 0 then
        TriggerServerEvent("job:anounce", "Réparez le boitier metal")
    else
        TriggerServerEvent("job:anounce", "Réparez le prochain boitier metal")
    end
    local coords = random_coord()
    createblip("ADSL", "Réparer l'metal", 761, coords)
    ClearGpsMultiRoute()
    StartGpsMultiRoute(6, true, true)
    AddPointToGpsMultiRoute(coords.x, coords.y, coords.z)
    SetGpsMultiRouteRender(true)
    exports["qb-target"]:AddBoxZone("adsl_zone", vector3(coords.x, coords.y, coords.z), coords.sx, coords.sy,
                                    {
        name = "adsl_zone",
        heading = coords.heading,
        minZ = coords.minZ,
        maxZ = coords.maxZ,
        debugPoly = false,
    }, {
        options = {{type = "client", event = "jobs:metal:fix", icon = "fas fa-sign-in-alt", label = "Réparer l'metal"}},
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

RegisterNetEvent("jobs:metal:end")
AddEventHandler("jobs:metal:end", function()
    TriggerServerEvent("job:set:unemployed")
    local money = Config.adsl_payout * payout_counter
    TriggerServerEvent("job:payout", money)
    QBCore.Functions.DeleteVehicle(metal_vehicule)
    exports["qb-target"]:RemoveZone("adsl_zone")
    destroyblip(job_blip)
    OnJob = false
    JobOutfit = false
    JobVehicle = false
    JobCounter = 0
    payout_counter = 0
    DrawDistance = 0
end)
