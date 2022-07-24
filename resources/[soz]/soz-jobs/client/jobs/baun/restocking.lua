RegisterNetEvent("soz-jobs:client:baun:restock", function(data)
    local action_message = "Vous commencez à restocker."
    local finished_message = "Vous avez terminé de restocker."
    QBCore.Functions.Progressbar("restock", action_message, BaunConfig.Durations.Restocking, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "rcmextreme3", anim = "idle", flags = 1}, {}, {}, function()
        QBCore.Functions.TriggerCallback("soz-jobs:server:baun:restock", function(success, reason)
            if success then
                TriggerEvent("soz-jobs:client:baun:restock", data)
            else
                if reason == "missing_ingredient" then
                    exports["soz-hud"]:DrawNotification(finished_message)
                else
                    exports["soz-hud"]:DrawNotification(string.format("Une erreur est survenue: %s.", reason), "error")
                end
            end
        end, data.storage, data.item)
    end, function()
        exports["soz-hud"]:DrawNotification(finished_message)
    end)
end)
