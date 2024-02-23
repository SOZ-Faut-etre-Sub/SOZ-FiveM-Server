QBCore = exports["qb-core"]:GetCoreObject()

BaunJob = {}
BaunJob.Functions = {}
BaunJob.MenuState = {}
BaunJob.Menu = MenuV:CreateMenu(nil, "", "menu_job_baun", "soz", "baun:menu")

BaunJob.Harvest = {}
BaunJob.CraftZones = {}

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

        BaunJob.Functions.InitHarvestingZones()
    end
end)

AddEventHandler("onClientResourceStop", function(resourceName)
    if (GetCurrentResourceName() == resourceName and GetConvarInt("feature_msb_baun", 0) == 1) then
        BaunJob.Functions.DestroyHarvestingZones()
    end
end)

RegisterNetEvent("soz-jobs:client:baun:createCocktailBox", function()
    QBCore.Functions.TriggerCallback("soz-jobs:server:baun:createCocktailBox", function()
    end)
end)
