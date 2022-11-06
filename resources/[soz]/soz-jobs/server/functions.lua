SozJobCore.Functions = {}

SozJobCore.Functions.HasPermission = function(targetJobId, jobID, jobGrade, permission)
    return CheckJobPermission(targetJobId, jobID, jobGrade, permission)
end

RegisterNetEvent("jobs:shop:server:buy", function(itemID)
    local player = QBCore.Functions.GetPlayer(source)
    local item = nil

    if player.PlayerData.job.id == SozJobCore.JobType.News then
        item = NewsConfig.BossShop[itemID]
    elseif player.PlayerData.job.id == SozJobCore.JobType.Food then
        item = FoodConfig.BossShop[itemID]
    end

    if item == nil then
        return
    end

    if player.Functions.RemoveMoney("money", item.price) then
        TriggerEvent("monitor:server:event", "shop_buy", {player_source = player.PlayerData.source, shop_type = "job"},
                     {item_name = item.name, amount = item.price})

        exports["soz-inventory"]:AddItem(player.PlayerData.source, item.name, item.amount, item.metadata, nil, function(success, reason)
            if success then
                TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source,
                                   ("Vous venez d'acheter ~b~%s %s~s~ pour ~g~$%s"):format(item.amount, QBCore.Shared.Items[item.name].label, item.price))
            end
        end)
    else
        TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source, "Vous n'avez pas assez d'argent", "error")
    end
end)
