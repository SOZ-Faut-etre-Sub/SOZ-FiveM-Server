BaunJob.Functions.InitHarvestingZones = function()

    --for _, harvestConfig in ipairs(BaunConfig.HarvestZones) do
    --    local harvestZone = {
    --        ComboZone = nil,
    --        Zones = {}
    --    }
    --    for _, config in ipairs(harvestConfig.zones) do
    --        print("Add zone: " .. json.encode(config.options.name))
    --        print("Config: " .. json.encode(config))
    --        exports["qb-target"]:AddBoxZone(
    --            config.options.name,
    --            config.center,
    --            config.length,
    --            config.width,
    --            config.options,
    --            {
    --                options = {
    --                    label = "Récupérer",
    --                    icon = "c:jobs/recuperer.png",
    --                    action = function()
    --                        print("Hello ?")
    --                    end,
    --                    --event = "soz-jobs:client:baun:harvest",
    --                    --blackoutGlobal = true,
    --                    --blackoutJob = "baun",
    --                    --give_item = harvestConfig.item,
    --                    --job = "baun",
    --                    --canInteract = function()
    --                    --    print("Hello harvest combo zone ?")
    --                    --    return true
    --                    --    --local hasPermission = SozJobCore.Functions.HasPermission("baun", SozJobCore.JobPermission.Food.Harvest)
    --                    --    --return hasPermission and PlayerData.job.onduty
    --                    --end
    --                },
    --                distance = 2.5,
    --            }
    --        )
    --    end
    --    table.insert(BaunJob.Harvest, harvestZone)
    --end
end

BaunJob.Functions.DestroyHarvestingZones = function()
    for _, harvest in ipairs(BaunJob.Harvest) do
        for _, zone in ipairs(harvest.Zones) do
            zone:destroy()
        end
    end
end

RegisterNetEvent("QBCore:Client:SetDuty", function(duty)
    if duty then
        BaunJob.Functions.InitHarvestingZones()
    else
        BaunJob.Functions.DestroyHarvestingZones()
    end
end)

RegisterNetEvent("soz-jobs:client:baun:harvest", function(data)
    print("data give_item: " .. json.encode(data.give_item))
end)
