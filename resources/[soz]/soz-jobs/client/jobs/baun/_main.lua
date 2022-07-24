QBCore = exports["qb-core"]:GetCoreObject()

BaunJob = {}
BaunJob.Functions = {}
-- TODO: Replace texture with menu_job_baun
BaunJob.Menu = MenuV:CreateMenu(nil, "", "default", "soz", "baun:menu")

BaunJob.Harvest = {}
BaunJob.CraftZones = {}

RegisterNetEvent("jobs:client:baun:OpenCloakroomMenu", function()
    SozJobCore.Functions.OpenCloakroomMenu(BaunJob.Menu, BaunConfig.Cloakroom.Clothes)
end)

AddEventHandler("onClientResourceStart", function(resourceName)
    if (GetCurrentResourceName() == resourceName) then
        for _, config in pairs(BaunConfig.Blips) do
            QBCore.Functions.CreateBlip(config.Id, {
                name = config.Name,
                coords = config.Coords,
                sprite = config.Icon,
                scale = config.Scale,
                color = config.Color,
                alpha = config.Alpha,
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
    end
end)
