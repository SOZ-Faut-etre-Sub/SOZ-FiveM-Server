-- FILL IN
QBCore.Functions.CreateCallback("soz-jobs:server:stonk-fill-in", function(source, cb, data)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        cb({success = false, reason = "invalid_player"})
        return
    end

    local itemCount = exports["soz-inventory"]:GetItem(Player.PlayerData.source, StonkConfig.Collection.BagItem, nil, true)
    if itemCount < 1 then
        cb({success = false, reason = "invalid_quantity"})
        return
    end

    local result = QBCore.Functions.TriggerRpc("banking:server:needRefill", source, data)
    if not result.needRefill then
        cb({success = false, reason = "invalid_money"})
        return
    end

    Player.Functions.RemoveItem(StonkConfig.Collection.BagItem, 1)

    local amount = StonkConfig.FillIn.Amount
    if amount > result.missingAmount then
        amount = result.missingAmount
    end
    TriggerEvent("banking:server:TransferMoney", StonkConfig.Accounts.BankAccount, result.accountId, amount)
    TriggerEvent("banking:server:TransferMoney", StonkConfig.Accounts.FarmAccount, StonkConfig.Accounts.SafeStorage, StonkConfig.Resale.BankPrice)

    if data.bank ~= nil then
        TriggerEvent("monitor:server:event", "job_stonk_fill_account", {
            player_source = source,
            account_type = "bank",
            account_id = result.accountId,
        }, {amount = tonumber(amount), position = GetEntityCoords(GetPlayerPed(source))})
    else
        TriggerEvent("monitor:server:event", "job_stonk_fill_account", {
            player_source = source,
            account_type = "atm",
            account_id = result.accountId,
        }, {amount = tonumber(amount), position = GetEntityCoords(GetPlayerPed(source))})
    end

    cb({success = true})
end)
