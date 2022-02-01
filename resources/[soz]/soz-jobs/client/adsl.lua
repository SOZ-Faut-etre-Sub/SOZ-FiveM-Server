local QBCore = exports["qb-core"]:GetCoreObject()
local payout_counter = 0
local OnJob = false

exports["qb-target"]:AddBoxZone("job adsl", vector3(479.13, -107.45, 62.71), 1, 1, {
    name = "job adsl",
    heading = 0,
    debugPoly = false,
}, {
    options = {
        {
            type = "client",
            event = "jobs:adsl:start",
            icon = "fas fa-sign-in-alt",
            label = "comencer le job adsl",
            job = "unemployed",
        },
        {
            type = "client",
            event = "jobs:adsl:start",
            icon = "fas fa-sign-in-alt",
            label = "continuer le job adsl",
            job = "adsl",
            canInteract = function()
                return OnJob == false
            end,
        },
        {
            type = "client",
            event = "jobs:adsl:end",
            icon = "fas fa-sign-in-alt",
            label = "finir le job adsl",
            job = "adsl",
        },
    },
    distance = 2.5,
})

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
    end)
    payout_counter = payout_counter + 1
    OnJob = false
end)

local function SpawnVehicule()
    local ModelHash = "utillitruck3"
    if not IsModelInCdimage(ModelHash) then
        return
    end
    RequestModel(ModelHash)
    adsl_vehicule = CreateVehicle(ModelHash, 500.79, -105.88, 62.07, 253.78, true, false)
end

RegisterNetEvent("jobs:adsl:start")
AddEventHandler("jobs:adsl:start", function()
    OnJob = true
    local coords = Config.adsl[math.random(#Config.adsl)]
    createblip(coords)
    if payout_counter == 0 then
        SpawnVehicule()
        TriggerServerEvent("job:set:pole", "adsl")
    end
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
end)

RegisterNetEvent("jobs:adsl:end")
AddEventHandler("jobs:adsl:end", function()
    TriggerServerEvent("job:set:unemployed")
    local money = Config.adsl_payout * payout_counter
    TriggerServerEvent("job:payout", money)
    DeleteVehicule(adsl_vehicule)
    if OnJob == true then
        exports["qb-target"]:RemoveZone("adsl_zone")
        destroyblip(blip)
        OnJob = false
    end
end)
