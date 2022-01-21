QBCore = exports["qb-core"]:GetCoreObject()

QBCore.Functions.CreateCallback('banking:getBankingInformation', function(source, cb)
    local Player = QBCore.Functions.GetPlayer(source)

    if Player then
        local account = Account(Player.PlayerData.charinfo.account)

        local banking = {
            ['name'] = Player.Functions.GetName(),
            ['accountinfo'] = account.id,
            ['bankbalance'] = QBCore.Shared.GroupDigits(account.amount) .. '$',
            ['money'] = QBCore.Shared.GroupDigits(Player.PlayerData.money['money']) .. '$',
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
        local AccountMoney = Account(accountSource).amount
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
