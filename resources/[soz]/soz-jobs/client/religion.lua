local QBCore = exports["qb-core"]:GetCoreObject()
local payout_counter = 0
local OnJob = false
local JobOutfit = false
local JobVehicle = false
local InVehicle = false
local ObjectifCoord = {}
local DrawDistance = 100

exports["qb-target"]:AddBoxZone("job religion", vector3(-766.24, -24.34, 41.07), 1, 1, {
    name = "job religion",
    heading = 0,
    debugPoly = false,
}, {
    options = {
        {
            type = "client",
            event = "jobs:religion:begin",
            icon = "fas fa-sign-in-alt",
            label = "Commencer le job religion",
            job = "unemployed",
        },
        {
            type = "client",
            event = "jobs:religion:tenue",
            icon = "fas fa-sign-in-alt",
            label = "Prendre la tenue",
            job = "religion",
            canInteract = function()
                return JobOutfit == false
            end,
        },
        {
            type = "client",
            event = "jobs:religion:vehicle",
            icon = "fas fa-sign-in-alt",
            label = "Sortir la voiture",
            job = "religion",
            canInteract = function()
                if JobOutfit == true then
                    return JobVehicle == false
                end
            end,
        },
        {
            type = "client",
            event = "jobs:religion:restart",
            icon = "fas fa-sign-in-alt",
            label = "Continuer le job religion",
            job = "religion",
            canInteract = function()
                return OnJob == false
            end,
        },
        {
            type = "client",
            event = "jobs:religion:end",
            icon = "fas fa-sign-in-alt",
            label = "Finir le job religion",
            job = "religion",
        },
    },
    distance = 2.5,
})

RegisterNetEvent("jobs:religion:fix")
AddEventHandler("jobs:religion:fix", function(ped)
    TriggerEvent("animations:client:EmoteCommandStart", {"namaste"})
    FreezeEntityPosition(ped, true)
    TaskPlayAnim(ped, nil, 'namaste', 8.0, 8.0, 10000, 0, 0, 0, 0, 0)
    QBCore.Functions.Progressbar("religion_fix", "Promouvoir la religion", 10000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {}, {}, {}, function()
        TriggerEvent("animations:client:EmoteCommandStart", {"c"})
        exports["qb-target"]:RemoveZone("religion_zone")
        destroyblip(job_blip)
        payout_counter = payout_counter + 1
        FreezeEntityPosition(ped, false)
        ClearGpsMultiRoute()
        OnJob = false
        TriggerServerEvent("job:anounce", "Retournez au point de départ pour continuer ou finir le job")
    end)
end)

local function SpawnVehicule()
    local ModelHash = "romero"
    local model = GetHashKey(ModelHash)
    if not IsModelInCdimage(model) then
        return
    end
    RequestModel(model)
    while not HasModelLoaded(model) do
        Citizen.Wait(10)
    end
    religion_vehicule = CreateVehicle(model, Config.religion_vehicule.x, Config.religion_vehicule.y, Config.religion_vehicule.z, Config.religion_vehicule.w, true, false)
    SetModelAsNoLongerNeeded(model)
end

RegisterNetEvent("jobs:religion:begin")
AddEventHandler("jobs:religion:begin", function()
    TriggerServerEvent("job:anounce", "Prenez la tenue")
    TriggerServerEvent("job:set:pole", "religion")
    OnJob = true
end)

RegisterNetEvent("jobs:religion:tenue")
AddEventHandler("jobs:religion:tenue", function()
    TriggerServerEvent("job:anounce", "Sortez le véhicule")
    JobOutfit = true
end)

RegisterNetEvent("jobs:religion:vehicle")
AddEventHandler("jobs:religion:vehicle", function()
    TriggerServerEvent("job:anounce", "Montez dans le véhicule de service")
    SpawnVehicule()
    JobVehicle = true
    createblip("Véhicule", "Montez dans le véhicule", 225, Config.religion_vehicule)
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
    local result = Config.religion[math.random(#Config.religion)]
    if result.x == JobDone then
        random_coord()
    end
    local JobDone = result.x
    return result
end

RegisterNetEvent("jobs:religion:start")
AddEventHandler("jobs:religion:start", function()
    TriggerServerEvent("job:anounce", "Rendez vous dans la zone")
    local coords = random_coord()
    createblip("religion", "Zone de conversion", 480, coords)
    ClearGpsMultiRoute()
    StartGpsMultiRoute(6, true, true)
    AddPointToGpsMultiRoute(coords.x, coords.y, coords.z)
    SetGpsMultiRouteRender(true)
    exports["qb-target"]:AddBoxZone("religion_zone", vector3(coords.x, coords.y, coords.z), coords.sx, coords.sy,
                                    {
        name = "religion_zone",
        heading = coords.heading,
        minZ = coords.minZ,
        maxZ = coords.maxZ,
        debugPoly = false,
    }, {
        options = {{type = "client", icon = "fas fa-sign-in-alt", label = "Parler d'epsylon",
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
        end
        }},
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
    TriggerServerEvent("job:anounce", "Parler a une personne d'epsylon")
end)

RegisterNetEvent("jobs:religion:end")
AddEventHandler("jobs:religion:end", function()
    TriggerServerEvent("job:set:unemployed")
    local money = Config.adsl_payout * payout_counter
    TriggerServerEvent("job:payout", money)
    QBCore.Functions.DeleteVehicle(religion_vehicule)
    exports["qb-target"]:RemoveZone("adsl_zone")
    destroyblip(job_blip)
    OnJob = false
    JobOutfit = false
    JobVehicle = false
    payout_counter = 0
end)
