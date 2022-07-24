local function getOptions(item)
    return {
        {
            color = "baun",
            type = "client",
            label = "Récupérer",
            icon = "c:jobs/recuperer.png",
            event = "soz-jobs:client:baun:harvest",
            blackoutGlobal = true,
            blackoutJob = "baun",
            job = "baun",
            canInteract = function()
                local hasPermission = SozJobCore.Functions.HasPermission("baun", SozJobCore.JobPermission.Baun.Harvest)
                return hasPermission and PlayerData.job.onduty
            end,
            -- metadata
            give_item = item,
        },
    }
end

local function createTargetBoxZone(item, config)
    exports["qb-target"]:AddBoxZone(config.options.name, config.center, config.length, config.width, config.options,
                                    {options = getOptions(item), distance = 2.5})
end

local function spawnPed(item, config)
    exports["qb-target"]:SpawnPed({
        {
            spawnNow = true,
            model = config.ped.model,
            coords = config.ped.coords,
            minusOne = true,
            freeze = true,
            invincible = true,
            blockevents = true,
            target = {options = getOptions(item), distance = 2.5},
        },
    })
end

local function createTargetPed(item, config)
    print("Spawning target ped")
    local zone = BoxZone:new(config.center, config.length, config.width, config.options)

    zone:onPlayerInOut(function(isPointInside)
        print("Is player inside: " .. json.encode(isPointInside))
        BaunJob.Harvest[config.options.name].isInside = isPointInside
        if isPointInside then
            exports["qb-target"]:AddTargetModel(config.ped.model, {
                options = {
                    {
                        color = "baun",
                        type = "client",
                        label = "Récupérer",
                        icon = "c:jobs/recuperer.png",
                        event = "soz-jobs:client:baun:harvest",
                        blackoutGlobal = true,
                        blackoutJob = "baun",
                        job = "baun",
                        canInteract = function()
                            local hasPermission = SozJobCore.Functions.HasPermission("baun", SozJobCore.JobPermission.Baun.Harvest)
                            return BaunJob.Harvest[config.options.name].isInside and hasPermission and PlayerData.job.onduty
                        end,
                        -- metadata
                        give_item = item,
                    },
                },
                distance = 2.0,
            })
        else
            exports["qb-target"]:RemoveTargetModel(config.ped.model, "Récupérer")
        end
    end)
end

BaunJob.Functions.InitHarvestingZones = function()
    for _, harvestConfig in ipairs(BaunConfig.HarvestZones) do
        for _, config in ipairs(harvestConfig.zones) do
            local harvest = {isInside = false}
            BaunJob.Harvest[config.options.name] = harvest
            if config.ped then
                spawnPed(harvestConfig.item, config)
                -- createTargetPed(harvestConfig.item, config)
            else
                createTargetBoxZone(harvestConfig.item, config)
            end
        end
    end
end

BaunJob.Functions.DestroyHarvestingZones = function()
    for zoneName, _ in ipairs(BaunJob.Harvest) do
        exports["qb-target"]:RemoveZone(zoneName)
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
    local item = QBCore.Shared.Items[data.give_item]
    local action_message = string.format("Vous récoltez des %s.", item.pluralLabel)
    local finished_message = string.format("Vous avez terminé de récolter des %s.", item.pluralLabel)
    QBCore.Functions.Progressbar("harvest-crate", action_message, BaunConfig.Durations.Harvesting, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {}, {}, {}, function()
        QBCore.Functions.TriggerCallback("soz-jobs:server:baun:harvest", function(success, reason)
            if success then
                TriggerEvent("soz-jobs:client:baun:harvest", data)
            else
                if reason ~= "invalid_weight" then
                    exports["soz-hud"]:DrawNotification(string.format("Il y a eu une erreur : `%s`", reason), "error")
                else
                    exports["soz-hud"]:DrawNotification(finished_message)
                end
            end
        end, data.give_item)
    end, function()
        exports["soz-hud"]:DrawNotification(finished_message)
    end)
end)
