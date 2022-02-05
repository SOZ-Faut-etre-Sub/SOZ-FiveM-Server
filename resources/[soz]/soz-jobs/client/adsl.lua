local QBCore = exports["qb-core"]:GetCoreObject()
local payout_counter = 0
local OnJob = false
local JobOutfit = false
local JobVehicle = false
local InVehicle = false
local JobCounter = 0
local JobDone = {}
local ObjectifCoord = {}
local DrawDistance = 0
local player = GetPlayerPed(-1)

exports["qb-target"]:AddBoxZone("job adsl", vector3(479.13, -107.45, 62.71), 1, 1, {
    name = "job adsl",
    heading = 0,
    debugPoly = false,
}, {
    options = {
        {
            type = "client",
            event = "jobs:adsl:begin",
            icon = "fas fa-sign-in-alt",
            label = "Commencer le job adsl",
            job = "unemployed",
        },
        {
            type = "client",
            event = "jobs:adsl:tenue",
            icon = "fas fa-sign-in-alt",
            label = "Prendre la tenue",
            job = "adsl",
            canInteract = function()
                return JobOutfit == false
            end,
        },
        {
            type = "client",
            event = "jobs:adsl:vehicle",
            icon = "fas fa-sign-in-alt",
            label = "Sortir la voiture",
            job = "adsl",
            canInteract = function()
                if JobOutfit == true then
                    return JobVehicle == false
                end
            end,
        },
        {
            type = "client",
            event = "jobs:adsl:restart",
            icon = "fas fa-sign-in-alt",
            label = "Continuer le job adsl",
            job = "adsl",
            canInteract = function()
                return OnJob == false
            end,
        },
        {
            type = "client",
            event = "jobs:adsl:end",
            icon = "fas fa-sign-in-alt",
            label = "Finir le job adsl",
            job = "adsl",
        },
    },
    distance = 2.5,
})

Citizen.CreateThread(function()
    while true do 
        Citizen.Wait(10)
        local coords = GetEntityCoords(player)
        local distance = GetDistanceBetweenCoords(coords.x, coords.y, coords.z, ObjectifCoord.x, ObjectifCoord.y, ObjectifCoord.z)
        if distance <= DrawDistance then
            DrawInteractionMarker(ObjectifCoord, true)
        else
            DrawInteractionMarker(ObjectifCoord, false)
        end
    end
end)

local function createblip(coords)
    blip = AddBlipForCoord(coords.x, coords.y, coords.z)
    SetBlipScale(blip, 1.0)
    SetBlipSprite(blip, 761)
    SetBlipColour(blip, 32)
    AddTextEntry("ADSL", "Réparer l'adsl")
    BeginTextCommandSetBlipName("ADSL")
    EndTextCommandSetBlipName(blip)
    SetBlipCategory(blip, 2)
end

RegisterNetEvent("jobs:adsl:fix")
AddEventHandler("jobs:adsl:fix", function()
    TriggerEvent("animations:client:EmoteCommandStart", {"mechanic"})
    QBCore.Functions.Progressbar("adsl_fix", "Répare l'adsl..", 10000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {}, {}, {}, function()
        TriggerEvent("animations:client:EmoteCommandStart", {"c"})
        exports["qb-target"]:RemoveZone("adsl_zone")
        destroyblip(blip)
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
    local ModelHash = "utillitruck3"
    if not IsModelInCdimage(ModelHash) then
        return
    end
    RequestModel(ModelHash)
    adsl_vehicule = CreateVehicle(ModelHash, 500.79, -105.88, 62.07, 253.78, true, false)
end

RegisterNetEvent("jobs:adsl:begin")
AddEventHandler("jobs:adsl:begin", function()
    TriggerServerEvent("job:anounce", "Prenez la tenue")
    TriggerServerEvent("job:set:pole", "adsl")
    OnJob = true
end)

RegisterNetEvent("jobs:adsl:tenue")
AddEventHandler("jobs:adsl:tenue", function()
    TriggerServerEvent("job:anounce", "Sortez le véhicule")
    JobOutfit = true
end)

RegisterNetEvent("jobs:adsl:vehicle")
AddEventHandler("jobs:adsl:vehicle", function()
    TriggerServerEvent("job:anounce", "Montez dans le véhicule de service")
    SpawnVehicule()
    JobVehicle = true
    while InVehicle == false do
        Citizen.Wait(10)
        if IsPedInVehicle(player, adsl_vehicule, true) == 1 then
            InVehicle = true
        end
    end
    TriggerEvent("jobs:adsl:start")
end)

RegisterNetEvent("jobs:adsl:restart")
AddEventHandler("jobs:adsl:restart", function()
    JobCounter = 0
    TriggerEvent("jobs:adsl:start")
end)

RegisterNetEvent("jobs:adsl:start")
AddEventHandler("jobs:adsl:start", function()
    if JobCounter == 0 then
        TriggerServerEvent("job:anounce", "Réparez le boitier adsl")
    else
        TriggerServerEvent("job:anounce", "Réparez le prochain boitier adsl")
    end
    local coords = Config.adsl[math.random(#Config.adsl)]
    createblip(coords)
    exports["qb-target"]:AddBoxZone("adsl_zone", vector3(coords.x, coords.y, coords.z), coords.sx, coords.sy,
                                    {
        name = "adsl_zone",
        heading = coords.heading,
        minZ = coords.minZ,
        maxZ = coords.maxZ,
        debugPoly = false,
    }, {
        options = {{type = "client", event = "jobs:adsl:fix", icon = "fas fa-sign-in-alt", label = "réparer l'adsl"}},
        distance = 1.5,
    })
    ObjectifCoord = coords
    DrawDistance = 50
end)

RegisterNetEvent("jobs:adsl:end")
AddEventHandler("jobs:adsl:end", function()
    TriggerServerEvent("job:set:unemployed")
    local money = Config.adsl_payout * payout_counter
    TriggerServerEvent("job:payout", money)
    DeleteVehicule(adsl_vehicule)
    exports["qb-target"]:RemoveZone("adsl_zone")
    destroyblip(blip)
    OnJob = false
    JobOutfit = false
    JobVehicle = false
    JobCounter = 0
    payout_counter = 0
    DrawDistance = 0
end)
