RegisterNetEvent("soz-jobs:client:baun:createIceCubes", function(data)
    QBCore.Functions.TriggerCallback("soz-jobs:server:baun:can-createIceCubes", function(canRestock)
        if canRestock then
            createIceCubes(data)
        end
    end, data.item)
end)

function createIceCubes(data)
    local action_message = "Vous commencez à fabriquer des glaçons."
    local stopped_message = "Vous avez arrêté de fabriquer des glaçons."
    local finished_message = "Vous avez terminé de fabriquer des glaçons."
    QBCore.Functions.Progressbar("restock", action_message, BaunConfig.Durations.Icecube, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "rcmextreme3", anim = "idle", flags = 1}, {}, {}, function()
        QBCore.Functions.TriggerCallback("soz-jobs:server:baun:createIceCubes", function(success, reason)
            if success then
                TriggerEvent("soz-jobs:client:baun:createIceCubes", data)
            else
                if reason == "missing_ingredient" then
                    exports["soz-core"]:DrawNotification(finished_message)
                elseif reason == "invalid_weight" then
                    exports["soz-core"]:DrawNotification("Le stockage est plein... ", "error")
                else
                    exports["soz-core"]:DrawNotification(string.format("Une erreur est survenue: %s.", reason), "error")
                end
            end
        end, data.storage, data.item)
    end, function()
        exports["soz-core"]:DrawNotification(stopped_message)
    end)
end

