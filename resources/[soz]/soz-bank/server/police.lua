
-- TODO: move this to policejob
QBCore.Functions.CreateCallback("police:getOtherPlayerData", function(source, cb, target)
    local Target = QBCore.Functions.GetPlayer(target)

    if Target then
        TriggerClientEvent("hud:client:DrawNotification", target, "Vous êtes en train d'être fouillé par le LSPD")

        local data = {
            name = Target.Functions.GetName(),
            job = Target.PlayerData.job.label,
            marked_money = Target.PlayerData.money["marked_money"],
        }

        cb(data)
    end
end)

RegisterNetEvent("police:confiscateMoney", function(target)
    local Player = QBCore.Functions.GetPlayer(source)
    local Target = QBCore.Functions.GetPlayer(target)

    if Player.PlayerData.job.name ~= "police" then
        print(("police: %s attempted to confiscate!"):format(Player.Functions.GetName()))
        return
    end

    local markedAmount = Target.Functions.GetMoney("marked_money")
    if Target.Functions.RemoveMoney("marked_money", markedAmount) then
        Player.Functions.AddMoney("marked_money", markedAmount)

        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source,
                           string.format("Vous avez confisqué ~g~%s$~s~ d'argent sale à ~y~%s~s~", markedAmount, Target.Functions.GetName()))
        TriggerClientEvent("hud:client:DrawNotification", Target.PlayerData.source,
                           string.format("~r~%s$~s~ d'argent sale ont été confisqués par ~y~%s~s~", markedAmount, Player.Functions.GetName()))
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~r~Problème de confiscation")
    end
end)
