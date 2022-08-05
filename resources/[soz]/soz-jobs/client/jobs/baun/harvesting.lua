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
                return PlayerData.job.onduty
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

BaunJob.Functions.InitHarvestingZones = function()
    for _, harvestConfig in ipairs(BaunConfig.HarvestZones) do
        for _, config in ipairs(harvestConfig.zones) do
            local harvest = {isInside = false}
            BaunJob.Harvest[config.options.name] = harvest
            if config.ped then
                spawnPed(harvestConfig.item, config)
            else
                createTargetBoxZone(harvestConfig.item, config)
            end
        end
    end
end

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
