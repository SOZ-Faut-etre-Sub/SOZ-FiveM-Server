local binProps = GetHashKey("prop_cs_bin_01_skinned")

--- Events
RegisterNetEvent("jobs:server:garbage:processBags", function()
    local Player = QBCore.Functions.GetPlayer(source)
    local playerGarbageBagAmount = exports["soz-inventory"]:GetItem(Player.PlayerData.source, "garbagebag", nil, true)
    local bagToProcess = 5

    if playerGarbageBagAmount < 1 then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Il vous manque ~r~un sac poubelle", "error")

        return
    elseif playerGarbageBagAmount < bagToProcess then
        bagToProcess = playerGarbageBagAmount
    end

    exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "garbagebag", bagToProcess)
    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez recyclé ~g~" .. bagToProcess .. " sacs poubelle")
    TriggerEvent("banking:server:TransfertMoney", "farm_garbage", "safe_garbage", bagToProcess * GarbageConfig.SellPrice)
    TriggerEvent("monitor:server:event", "job_bluebird_recycling_garbage_bag", {
        player_source = Player.PlayerData.source,
    }, {quantity = tonumber(bagToProcess), position = GetEntityCoords(GetPlayerPed(Player.PlayerData.source))})

    if exports["soz-inventory"]:GetItem(Player.PlayerData.source, "garbagebag", nil, true) >= 1 then
        TriggerClientEvent("jobs:client:garbage:processBags", Player.PlayerData.source)
    end
end)

