QBCore.Functions.CreateCallback("police:getOtherPlayerData", function(source, cb, target)
    local srcPlayer = QBCore.Functions.GetPlayer(source)
    local srcJob = SozJobCore.Jobs[srcPlayer.PlayerData.job.id].label
    local Target = QBCore.Functions.GetPlayer(target)

    if Target then
        TriggerClientEvent("hud:client:DrawNotification", target, "Vous êtes en train d'être fouillé par le " .. srcJob, "info")

        local data = {
            name = Target.Functions.GetName(),
            job = Target.PlayerData.job.id,
            marked_money = Target.PlayerData.money["marked_money"],
        }

        cb(data)
    end
end)

RegisterNetEvent("police:confiscateMoney", function(target)
    local Player = QBCore.Functions.GetPlayer(source)
    local Target = QBCore.Functions.GetPlayer(target)

    for _, allowedJob in ipairs(Config.AllowedJobInteraction) do
        if Player.PlayerData.job.id == allowedJob then
            local markedAmount = Target.Functions.GetMoney("marked_money")
            if Target.Functions.RemoveMoney("marked_money", markedAmount) and
                exports["soz-bank"]:AddMoney("safe_" .. Player.PlayerData.job.id, markedAmount, "marked_money", true) then
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source,
                                   string.format("Vous avez confisqué ~g~%s$~s~ d'argent marqué", markedAmount))
                TriggerClientEvent("hud:client:DrawNotification", Target.PlayerData.source,
                                   string.format("~r~%s$~s~ d'argent marqué ont été confisqués", markedAmount))
            else
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Problème de confiscation", "error")
            end

            return
        end
    end
end)
