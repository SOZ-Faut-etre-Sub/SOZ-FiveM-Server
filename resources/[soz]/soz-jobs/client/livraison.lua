<<<<<<< HEAD
local QBCore = exports['qb-core']:GetCoreObject()
local payout_counter = 0
local OnJob = false

exports['qb-target']:AddBoxZone("job livraison", vector3(-424.18, -2789.71, 6.0), 1, 1,{
    name = "job livraison",
    heading = 0,
    debugPoly = false,
    }, {
        options = {
            {
                type = "client",
                event = "jobs:livraison:start",
                icon = "fas fa-sign-in-alt",
                label = "comencer le job livraison",
                job = "unemployed",
            },
            {
                type = "client",
                event = "jobs:livraison:start",
                icon = "fas fa-sign-in-alt",
                label = "continuer le job livraison",
                job = "livraison",
                canInteract = function()
                    return OnJob == false
                end,
            },
            {
                type = "client",
                event = "jobs:livraison:end",
                icon = "fas fa-sign-in-alt",
                label = "finir le job livraison",
                job = "livraison",
            },
        },
        distance = 2.5
=======
local QBCore = exports["qb-core"]:GetCoreObject()
local payout_counter = 0
local OnJob = false

exports["qb-target"]:AddBoxZone("job livraison", vector3(-424.18, -2789.71, 6.0), 1, 1, {
    name = "job livraison",
    heading = 0,
    debugPoly = false,
}, {
    options = {
        {
            type = "client",
            event = "jobs:livraison:start",
            icon = "fas fa-sign-in-alt",
            label = "comencer le job livraison",
            job = "unemployed",
        },
        {
            type = "client",
            event = "jobs:livraison:start",
            icon = "fas fa-sign-in-alt",
            label = "continuer le job livraison",
            job = "livraison",
            canInteract = function()
                return OnJob == false
            end,
        },
        {
            type = "client",
            event = "jobs:livraison:end",
            icon = "fas fa-sign-in-alt",
            label = "finir le job livraison",
            job = "livraison",
        },
    },
    distance = 2.5,
>>>>>>> main
})

local function createblip(coords)
    blip = AddBlipForCoord(coords.x, coords.y, coords.z)
    SetBlipScale(blip, 1.0)
    SetBlipSprite(blip, 525)
    SetBlipColour(blip, 32)
    AddTextEntry("Livraison", "livrer à cette adresse")
    BeginTextCommandSetBlipName("Livraison")
    EndTextCommandSetBlipName(blip)
    SetBlipCategory(blip, 2)
end

local function destroyblip(blip)
    RemoveBlip(blip)
    blip = nil
end

RegisterNetEvent("jobs:livraison:fix")
AddEventHandler("jobs:livraison:fix", function()
    TriggerEvent("animations:client:EmoteCommandStart", {"mechanic"})
<<<<<<< HEAD
    QBCore.Functions.Progressbar("adsl_fix", "livraison..", 10000, false, true, {
        disableMovement = true,
        disableCarMovement = true,
		    disableMouse = false,
		    disableCombat = true,
    }, {}, {}, {}, function()
        TriggerEvent('animations:client:EmoteCommandStart', {"c"})
        exports['qb-target']:RemoveZone("livraison_zone")
=======
    QBCore.Functions.Progressbar("adsl_fix", "livraison..", 10000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {}, {}, {}, function()
        TriggerEvent("animations:client:EmoteCommandStart", {"c"})
        exports["qb-target"]:RemoveZone("livraison_zone")
>>>>>>> main
        destroyblip(blip)
    end)
    payout_counter = payout_counter + 1
    OnJob = false
end)

<<<<<<< HEAD
local function SpawnVehicule()
    local ModelHash = "faggio"
    if not IsModelInCdimage(ModelHash) then return end
        RequestModel(ModelHash)
    adsl_vehicule = CreateVehicle(ModelHash , -413.45 , -2791.54, 7.0, 317.52, true, false)
=======
local function DeleteVehicule(vehicule)
    SetEntityAsMissionEntity(vehicule, true, true)
    DeleteVehicle(vehicule)
end

local function SpawnVehicule()
    local ModelHash = "faggio"
    if not IsModelInCdimage(ModelHash) then
        return
    end
    RequestModel(ModelHash)
    adsl_vehicule = CreateVehicle(ModelHash, -413.45, -2791.54, 7.0, 317.52, true, false)
>>>>>>> main
end

RegisterNetEvent("jobs:livraison:start")
AddEventHandler("jobs:livraison:start", function()
    OnJob = true
    local coords = Config.livraison[math.random(#Config.livraison)]
    createblip(coords)
    if payout_counter == 0 then
        SpawnVehicule()
        TriggerServerEvent("job:set:pole", "livraison")
    end
<<<<<<< HEAD
    exports['qb-target']:AddBoxZone("livraison_zone", vector3(coords.x, coords.y, coords.z), coords.sx, coords.sy,{
=======
    exports["qb-target"]:AddBoxZone("livraison_zone", vector3(coords.x, coords.y, coords.z), coords.sx, coords.sy,
                                    {
>>>>>>> main
        name = "livraison_zone",
        heading = coords.heading,
        minZ = coords.minZ,
        maxZ = coords.maxZ,
        debugPoly = false,
<<<<<<< HEAD
        }, {
            options = {
                {
                    type = "client",
                    event = "jobs:livraison:fix",
	    			icon = "fas fa-sign-in-alt",
	    			label = "livraison en cours",
               },
           },
        distance = 1.5
=======
    }, {
        options = {
            {type = "client", event = "jobs:livraison:fix", icon = "fas fa-sign-in-alt", label = "livraison en cours"},
        },
        distance = 1.5,
>>>>>>> main
    })
end)

RegisterNetEvent("jobs:livraison:end")
AddEventHandler("jobs:livraison:end", function()
    TriggerServerEvent("job:set:unemployed")
    local money = Config.livraison_payout * payout_counter
    TriggerServerEvent("job:payout", money)
<<<<<<< HEAD
    QBCore.Functions.DeleteVehicle(adsl_vehicule)
end)
=======
    DeleteVehicule(adsl_vehicule)
end)
>>>>>>> main
