local QBCore = exports["qb-core"]:GetCoreObject()
local OnJob = false
local JobOutfit = false
local JobVehicle = false
local InVehicle = false
local ObjectifCoord = {}
local Counter = 0
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
            job = Config.JobType.Unemployed,
        },
        {
            type = "client",
            event = "jobs:metal:tenue",
            icon = "fas fa-sign-in-alt",
            label = "Prendre la tenue",
            job = Config.JobType.Scrapper,
            canInteract = function()
                return JobOutfit == false
            end,
        },
        {
            type = "client",
            event = "jobs:metal:vehicle",
            icon = "fas fa-sign-in-alt",
            label = "Sortir le véhicule",
            job = Config.JobType.Scrapper,
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
            job = Config.JobType.Scrapper,
            canInteract = function()
                return OnJob == false
            end,
        },
        {
            type = "client",
            event = "jobs:metal:vente",
            icon = "fas fa-sign-in-alt",
            label = "Vendre du métal",
            job = Config.JobType.Scrapper,
            item = "metalscrap",
        },
        {
            type = "client",
            event = "jobs:metal:end",
            icon = "fas fa-sign-in-alt",
            label = "Finir le job de récolte de metal",
            job = Config.JobType.Scrapper,
        },
    },
    distance = 2.5,
})

RegisterNetEvent("jobs:metal:fix")
AddEventHandler("jobs:metal:fix", function()
    TriggerEvent("animations:client:EmoteCommandStart", {"mechanic"})
    QBCore.Functions.Progressbar("adsl_fix", "Récolte du metal..", 10000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {}, {}, {}, function()
        TriggerEvent("animations:client:EmoteCommandStart", {"c"})
        TriggerEvent("animations:client:EmoteCommandStart", {"pickup"})
        amount = math.random(5, 15)
        TriggerServerEvent("job:get:metal", amount)
        exports["qb-target"]:RemoveZone("adsl_zone")
        DrawInteractionMarker(ObjectifCoord, false)
        TriggerEvent("jobs:metal:start")
    end)
end)

local function SpawnVehicule()
    local ModelHash = "scrap"
    local model = GetHashKey(ModelHash)
    if not IsModelInCdimage(model) then
        return
    end
    RequestModel(model)
    while not HasModelLoaded(model) do
        Citizen.Wait(10)
    end
    metal_vehicule = CreateVehicle(model, Config.metal_vehicule.x, Config.metal_vehicule.y, Config.metal_vehicule.z, Config.metal_vehicule.w, true, false)
    SetModelAsNoLongerNeeded(model)
    VehPlate = QBCore.Functions.GetPlate(metal_vehicule)
    TriggerServerEvent("vehiclekeys:server:SetVehicleOwner", VehPlate)
end

RegisterNetEvent("jobs:metal:vente")
AddEventHandler("jobs:metal:vente", function()
    local sellamount = exports["soz-hud"]:Input(("Combien de métal scrap voulez vous vendre?"), 2)
    TriggerServerEvent("job:remove:metal", sellamount)
    Counter = 0
end)

RegisterNetEvent("jobs:metal:begin")
AddEventHandler("jobs:metal:begin", function()
    TriggerServerEvent("job:anounce", "Prenez la tenue")
    TriggerServerEvent("job:set:pole", Config.JobType.Scrapper)
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
    TriggerEvent("jobs:metal:prestart")
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

RegisterNetEvent("jobs:metal:prestart")
AddEventHandler("jobs:metal:prestart", function()
    TriggerServerEvent("job:anounce", "Rendez-vous dans la zone de récolte")
    DrawDistance = 100
    local ZoneRecolte = {x = -465.04, y = -1709.02, z = 18.74}
    createblip("metal", "Zone de récolte", 801, ZoneRecolte)
    ClearGpsMultiRoute()
    StartGpsMultiRoute(6, true, true)
    AddPointToGpsMultiRoute(ZoneRecolte.x, ZoneRecolte.y, ZoneRecolte.z)
    SetGpsMultiRouteRender(true)
    while DrawDistance >= 50 do
        Citizen.Wait(1000)
        local player = GetPlayerPed(-1)
        local CoordPlayer = GetEntityCoords(player)
        DrawDistance = GetDistanceBetweenCoords(CoordPlayer.x, CoordPlayer.y, CoordPlayer.z, ZoneRecolte.x, ZoneRecolte.y, ZoneRecolte.z)
    end

    TriggerEvent("jobs:metal:start")
end)

RegisterNetEvent("jobs:metal:start")
AddEventHandler("jobs:metal:start", function()
    if Counter == 0 then
        TriggerServerEvent("job:anounce", "Récoltez du métal")
        Citizen.Wait(500)
        TriggerServerEvent("job:anounce", "Puis retournez le vendre au patron")
    end
    local coords = random_coord()
    exports["qb-target"]:AddBoxZone("metal_zone", vector3(coords.x, coords.y, coords.z), coords.sx, coords.sy,
                                    {
        name = "metal_zone",
        heading = coords.heading,
        minZ = coords.minZ,
        maxZ = coords.maxZ,
        debugPoly = false,
    }, {
        options = {
            {type = "client", event = "jobs:metal:fix", icon = "fas fa-sign-in-alt", label = "Récolter du métal"},
        },
        distance = 2.5,
    })
    ObjectifCoord = coords
    DrawInteractionMarker(ObjectifCoord, true)
    Counter = Counter + 1
end)

RegisterNetEvent("jobs:metal:end")
AddEventHandler("jobs:metal:end", function()
    TriggerServerEvent("job:set:unemployed")
    QBCore.Functions.DeleteVehicle(metal_vehicule)
    exports["qb-target"]:RemoveZone("metal_zone")
    destroyblip(job_blip)
    SetGpsMultiRouteRender(false)
    OnJob = false
    JobOutfit = false
    JobVehicle = false
    Counter = 0
end)
