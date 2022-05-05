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
            icon = "c:pole/start.png",
            label = "Job DeMetal",
            job = SozJobCore.JobType.Unemployed,
        },
        {
            type = "client",
            event = "jobs:metal:tenue",
            icon = "c:pole/equip.png",
            label = "S'équiper",
            job = SozJobCore.JobType.Scrapper,
            canInteract = function()
                return JobOutfit == false
            end,
        },
        {
            type = "client",
            event = "jobs:metal:vehicle",
            icon = "c:pole/vehicle.png",
            label = "Sortir",
            job = SozJobCore.JobType.Scrapper,
            canInteract = function()
                if JobOutfit == true then
                    return JobVehicle == false
                end
            end,
        },
        {
            type = "client",
            event = "jobs:metal:restart",
            icon = "c:pole/restart.png",
            label = "Relancer",
            job = SozJobCore.JobType.Scrapper,
            canInteract = function()
                return OnJob == false
            end,
        },
        {
            type = "client",
            event = "jobs:metal:vente",
            icon = "fas fa-sign-in-alt",
            label = "Vendre du métal",
            job = SozJobCore.JobType.Scrapper,
            item = "metalscrap",
        },
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

RegisterNetEvent("jobs:metal:fix")
AddEventHandler("jobs:metal:fix", function()
    QBCore.Functions.Progressbar("adsl_fix", "Récolte du metal..", 10000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "mini@repair", anim = "fixing_a_ped"}, {}, {}, function()
        TaskPlayAnim(PlayerPedId(), "random@domestic", "pickup_low", 8.0, -8.0, -1, 49, 0, 0, 0, 0)
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
    metal_vehicule = CreateVehicle(model, SozJobCore.metal_vehicule.x, SozJobCore.metal_vehicule.y, SozJobCore.metal_vehicule.z, SozJobCore.metal_vehicule.w,
                                   true, false)
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
    TriggerServerEvent("job:set:pole", SozJobCore.JobType.Scrapper)
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
    createblip("Véhicule", "Montez dans le véhicule", 225, SozJobCore.metal_vehicule)
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
    local result = SozJobCore.metal[math.random(#SozJobCore.metal)]
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
        options = {{type = "client", event = "jobs:metal:fix", icon = "c:pole/recolter.png", label = "Récolter"}},
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
