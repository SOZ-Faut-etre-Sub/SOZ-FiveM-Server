QBCore = exports["qb-core"]:GetCoreObject()

QBCore.Functions.CreateCallback("banking:getBankingInformation", function(source, cb)
    local Player = QBCore.Functions.GetPlayer(source)

    if Player then
        local account = Account(Player.PlayerData.charinfo.account)

        local banking = {
            ["name"] = Player.Functions.GetName(),
            ["accountinfo"] = account.id,
            ["bankbalance"] = QBCore.Shared.GroupDigits(account.money) .. "$",
            ["money"] = QBCore.Shared.GroupDigits(Player.PlayerData.money["money"]) .. "$",
        }
        cb(banking)
    else
        cb(nil)
    end
end)

QBCore.Functions.CreateCallback("banking:server:TransfertMoney", function(source, cb, accountSource, accountTarget, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    local CurrentMoney = Player.Functions.GetMoney("money")
    amount = tonumber(amount)

    if accountSource == "player" then
        if amount <= CurrentMoney then
            if Player.Functions.RemoveMoney("money", amount) then
                Account.AddMoney(accountTarget, amount)
                cb(true)
                return
            end
        end
    elseif accountTarget == "player" then
        local AccountMoney = Account(accountSource).money
        if amount <= AccountMoney then
            if Player.Functions.AddMoney("money", amount) then
                Account.RemoveMoney(accountSource, amount)
                cb(true)
                return
            end
        end
    else
        Account.TransfertMoney(accountSource, accountTarget, amount, function(success, reason)
            cb(success, reason)
            return
        end)
    end

    cb(false, "unknown")
end)

RegisterNetEvent("baking:server:SafeStorageDeposit", function(money_type, safeStorage, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    local CurrentMoney = Player.Functions.GetMoney(money_type)
    amount = tonumber(amount)

    if money_type == "money" or money_type == "marked_money" then
        if amount <= CurrentMoney then
            if Player.Functions.RemoveMoney(money_type, amount) then
                Account.AddMoney(safeStorage, amount, money_type)
            end
        else
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~r~Vous n'avez pas assez d'argent")
        end
    end
end)

RegisterNetEvent("baking:server:SafeStorageWithdraw", function(money_type, safeStorage, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    amount = tonumber(amount)

    if money_type == "money" or money_type == "marked_money" then
        local CurrentMoney = Account(safeStorage)[money_type]
        if amount <= CurrentMoney then
            if Player.Functions.AddMoney(money_type, amount) then
                Account.RemoveMoney(safeStorage, amount, money_type)
            end
        else
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~r~Vous n'avez pas assez d'argent")
        end
    end
end)

QBCore.Functions.CreateCallback("banking:server:openSafeStorage", function(source, cb, safeStorage)
    local account = Account(safeStorage)

    if account and Account.AccessGranted(account, source) then
        cb(true, account.money, account.marked_money)
    else
        cb(false)
    end
end)
