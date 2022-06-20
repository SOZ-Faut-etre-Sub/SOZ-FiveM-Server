--- Events
RegisterNetEvent("jobs:server:garbage:processBags", function(item)
    if QBCore.Shared.Items[item] == nil then
        return
    end

    local Player = QBCore.Functions.GetPlayer(source)
    local playerGarbageBagAmount = exports["soz-inventory"]:GetItem(Player.PlayerData.source, item, nil, true)
    local bagToProcess = GarbageConfig.RecycleItem[item]

    if playerGarbageBagAmount < 1 then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Il vous manque ~r~un " .. QBCore.Shared.Items[item].label, "error")

        return
    elseif playerGarbageBagAmount < bagToProcess then
        bagToProcess = playerGarbageBagAmount
    end

    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item, bagToProcess) then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source,
                           ("Vous avez recyclé ~g~%d %s"):format(bagToProcess, QBCore.Shared.Items[item].label))

        local resellPrice = GarbageConfig.SellPrice[item] or GarbageConfig.SellPrice["default"]
        TriggerEvent("banking:server:TransferMoney", "farm_garbage", "safe_garbage", bagToProcess * resellPrice)
        TriggerEvent("monitor:server:event", "job_bluebird_recycling_garbage_bag", {
            player_source = Player.PlayerData.source,
            item = item,
        }, {quantity = tonumber(bagToProcess), position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source))})
    end

    if exports["soz-inventory"]:GetItem(Player.PlayerData.source, item, nil, true) >= 1 then
        TriggerClientEvent("jobs:client:garbage:processBags", Player.PlayerData.source, {item = item})
    end
end)

RegisterNetEvent("jobs:server:garbage:processExpired", function(slot)
    local Player = QBCore.Functions.GetPlayer(source)
    local playerGarbageExpired = exports["soz-inventory"]:GetSlot(Player.PlayerData.source, slot)

    if not playerGarbageExpired then
        return
    end

    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, playerGarbageExpired.name, playerGarbageExpired.amount, playerGarbageExpired.metadata,
                                           playerGarbageExpired.slot) then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source,
                           ("Vous avez recyclé ~g~%d %s"):format(playerGarbageExpired.amount, playerGarbageExpired.label))

        TriggerEvent("banking:server:TransferMoney", "farm_garbage", "safe_garbage", playerGarbageExpired.amount * GarbageConfig.SellPrice["default"])
        TriggerEvent("monitor:server:event", "job_bluebird_recycling_garbage_bag", {
            player_source = Player.PlayerData.source,
            item = playerGarbageExpired.name,
        }, {
            quantity = tonumber(playerGarbageExpired.amount),
            position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source)),
        })
    end

    TriggerClientEvent("jobs:client:garbage:processExpired", Player.PlayerData.source, {})
end)

