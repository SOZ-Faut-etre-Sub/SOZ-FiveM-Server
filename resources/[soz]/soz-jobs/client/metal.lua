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
            event = "jobs:metal:begin",
            icon = "c:pole/start.png",
            label = "Job DeMetal",
            job = SozJobCore.JobType.Unemployed,
            blackoutGlobal = true,
        },
        {
            type = "client",
            event = "jobs:metal:tenue",
            icon = "c:pole/equip.png",
            label = "S'équiper",
            job = SozJobCore.JobType.Scrapper,
            blackoutGlobal = true,
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
            blackoutGlobal = true,
            canInteract = function()
                if JobOutfit == true then
                    return JobVehicle == false
                end
            end,
        },
        {
            type = "client",
            event = "jobs:metal:vente",
            icon = "fas fa-sign-in-alt",
            label = "Vendre de la ferraille",
            job = SozJobCore.JobType.Scrapper,
            blackoutGlobal = true,
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
    DrawInteractionMarker(ObjectifCoord, false)
    QBCore.Functions.Progressbar("adsl_fix", "Vous cherchez de la ferraille...", 10000, false, false,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "mini@repair", anim = "fixing_a_ped"}, {}, {}, function()
        TaskPlayAnim(PlayerPedId(), "random@domestic", "pickup_low", 8.0, -8.0, -1, 49, 0, 0, 0, 0)
        amount = math.random(1, 2)
        TriggerServerEvent("job:get:metal", amount)
        TriggerEvent("jobs:metal:start")
    end)
end)

RegisterNetEvent("jobs:metal:vente")
AddEventHandler("jobs:metal:vente", function()
    local count = 0
    for _, item in pairs(PlayerData.items or {}) do
        if item.name == "metalscrap" then
            count = item.amount
        end
    end

    local sellamount = exports["soz-hud"]:Input(("Combien de ferrailles voulez-vous vendre ?"), 2, count)
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
    QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
        disableMovement = true,
        disableCombat = true,
    }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
        TriggerServerEvent("soz-character:server:SetPlayerJobClothes", SozJobCore.metal_clothes[PlayerData.skin.Model.Hash])
        TriggerServerEvent("job:anounce", "Sortez le véhicule")
        JobOutfit = true
    end)
end)

RegisterNetEvent("jobs:metal:vehicle")
AddEventHandler("jobs:metal:vehicle", function()
    TriggerServerEvent("job:anounce", "Montez dans le véhicule de service")
    TriggerServerEvent("soz-core:server:vehicle:free-job-spawn", "scrap",
                       {
        SozJobCore.metal_vehicule.x,
        SozJobCore.metal_vehicule.y,
        SozJobCore.metal_vehicule.z,
        SozJobCore.metal_vehicule.w,
    }, "jobs:metal:vehicle-spawn")
end)

RegisterNetEvent("jobs:metal:vehicle-spawn")
AddEventHandler("jobs:metal:vehicle-spawn", function(vehicleNetId)
    metal_vehicule = NetworkGetEntityFromNetworkId(vehicleNetId)
    JobVehicle = true
    createblip("Véhicule", "Montez dans le véhicule", 225, SozJobCore.metal_vehicule)
    local player = PlayerPedId()
    while InVehicle == false do
        Citizen.Wait(100)
        if IsPedInVehicle(player, metal_vehicule, true) == 1 then
            InVehicle = true
        end
    end
    destroyblip(job_blip)
    TriggerEvent("jobs:metal:prestart")
end)

local function random_coord()
    local result = SozJobCore.metal[math.random(#SozJobCore.metal)]
    while result.x == JobDone do
        result = SozJobCore.metal[math.random(#SozJobCore.metal)]
    end
    JobDone = result.x
    return result
end

RegisterNetEvent("jobs:metal:prestart")
AddEventHandler("jobs:metal:prestart", function()
    TriggerServerEvent("job:anounce", "Rendez-vous dans la zone de récolte")
    local ZoneRecolte = {x = -465.04, y = -1709.02, z = 18.74, w = 0.0}
    createblip("metal", "Zone de récolte", 801, ZoneRecolte)
    ClearGpsMultiRoute()
    StartGpsMultiRoute(6, true, true)
    AddPointToGpsMultiRoute(ZoneRecolte.x, ZoneRecolte.y, ZoneRecolte.z)
    SetGpsMultiRouteRender(true)

    harvestZone = PolyZone:Create({
        vector3(-399.53, -1675.22, 19.0),
        vector3(-429.21, -1755.87, 19.0),
        vector3(-488.37, -1765.92, 19.0),
        vector3(-474.18, -1651.1, 19.0),
    }, {name = "metal-harvest", minZ = 18.0, maxZ = 23.0, debugPoly = false})
    harvestZone:onPlayerInOut(function(isInside)
        if isInside then
            if not hasEnteredZoneOnce then
                hasEnteredZoneOnce = true
                TriggerEvent("jobs:metal:start")
            end
            DrawInteractionMarker(ObjectifCoord, true)
        else
            DrawInteractionMarker(ObjectifCoord, false)
        end
    end)
end)

RegisterNetEvent("jobs:metal:start")
AddEventHandler("jobs:metal:start", function()
    if Counter == 0 then
        TriggerServerEvent("job:anounce", "Récoltez de la ~b~ferraille~s~")
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
        distance = 1.5,
    })
    DrawInteractionMarker(ObjectifCoord, false)
    ObjectifCoord = coords
    DrawInteractionMarker(ObjectifCoord, true)
    Counter = Counter + 1
end)

local function close()
    TriggerServerEvent("job:set:unemployed")
    QBCore.Functions.DeleteVehicle(metal_vehicule)
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
