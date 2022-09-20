QBCore = exports["qb-core"]:GetCoreObject()

BaunJob = {}
BaunJob.Functions = {}
BaunJob.MenuState = {}
BaunJob.Menu = MenuV:CreateMenu(nil, "", "menu_job_baun", "soz", "baun:menu")

BaunJob.Harvest = {}
BaunJob.CraftZones = {}

RegisterNetEvent("jobs:client:baun:OpenCloakroomMenu", function()
    SozJobCore.Functions.OpenCloakroomMenu(BaunJob.Menu, BaunConfig.Cloakroom.Clothes)
end)

local function getItem(items, itemId)
    for _, item in ipairs(items) do
        if item.name == itemId then
            return item
        end
    end
    return {amount = 0}
end

AddEventHandler("onClientResourceStart", function(resourceName)
    if (GetCurrentResourceName() == resourceName and GetConvarInt("feature_msb_baun", 0) == 1) then
        for _, config in pairs(BaunConfig.Blips) do
            QBCore.Functions.CreateBlip(config.Id, {
                name = config.Name,
                coords = config.Coords,
                sprite = config.Icon,
                scale = config.Scale,
            })
        end

        for _, zone in pairs(BaunConfig.Cloakroom.Zones) do
            exports["qb-target"]:AddBoxZone(zone.options.name, zone.center, zone.length, zone.width, zone.options, {
                options = {
                    {
                        label = "S'habiller",
                        icon = "c:jobs/habiller.png",
                        event = "jobs:client:baun:OpenCloakroomMenu",
                        job = "baun",
                        canInteract = function()
                            return PlayerData.job.onduty
                        end,
                    },
                },
                distance = 2.5,
            })
        end

        BaunJob.Functions.InitHarvestingZones()
    end
end)

AddEventHandler("onClientResourceStop", function(resourceName)
    if (GetCurrentResourceName() == resourceName and GetConvarInt("feature_msb_baun", 0) == 1) then
        BaunJob.Functions.DestroyHarvestingZones()
    end
end)

RegisterNetEvent("soz-jobs:client:baun:createCocktailBox", function()
    QBCore.Functions.TriggerCallback("soz-jobs:server:baun:createCocktailBox", function(success, reason)
    end)
end)

exports["qb-target"]:AddBoxZone("baun:bahama:duty", vector3(-1388.11, -606.23, 30.32), 0.55, 0.55,
                                {name = "baun:bahama:duty", heading = 16, minZ = 30.32, maxZ = 30.87},
                                {options = SozJobCore.Functions.GetDutyActions("baun"), distance = 2.5})

exports["qb-target"]:AddBoxZone("baun:unicorn:duty", vector3(133.53, -1286.86, 29.27), 0.45, 0.5,
                                {name = "baun:unicorn:duty", heading = 345, minZ = 29.27, maxZ = 29.67},
                                {options = SozJobCore.Functions.GetDutyActions("baun"), distance = 2.5})
