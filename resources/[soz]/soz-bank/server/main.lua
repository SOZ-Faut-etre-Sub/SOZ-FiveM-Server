QBCore = exports["qb-core"]:GetCoreObject()

QBCore.Functions.CreateCallback("banking:getBankingInformation", function(source, cb, account)
    local Player = QBCore.Functions.GetPlayer(source)

    if Player then
        if account == nil then
            account = Account(Player.PlayerData.charinfo.account)
        else
            if string.find(account, "%d%d%d%u%d%d%d%d%u%d%d%d") then
                account = Account(account)
            elseif exports["soz-core"]:HasJobPermission(account, Player.PlayerData.job.id, Player.PlayerData.job.grade, "society-bank-account") then
                account = Account(account)
            else
                cb(nil)
                return
            end
        end

        local banking = {
            ["name"] = Player.Functions.GetName(),
            ["accountinfo"] = account.id,
            ["bankbalance"] = QBCore.Shared.GroupDigits(account.money) .. "$",
            ["money"] = QBCore.Shared.GroupDigits(QBCore.Shared.Round(Player.PlayerData.money["money"])) .. "$",
        }

        local offshore = Account("offshore_" .. account.id)
        if offshore ~= nil then
            banking["offshore"] = QBCore.Shared.GroupDigits(offshore.marked_money) .. "$"
        end

        cb(banking)
    else
        cb(nil)
    end
end)

QBCore.Functions.CreateCallback("banking:server:createOffshoreAccount", function(source, cb, account)
    local Player = QBCore.Functions.GetPlayer(source)
    local offshore = Account("offshore_" .. account)

    if exports["soz-core"]:HasJobPermission(account, Player.PlayerData.job.id, Player.PlayerData.job.grade, "society-bank-account") then
        if offshore == nil then
            Account.Create("offshore_" .. account, "Compte offshore " .. account, "offshore", "offshore_" .. account)
            cb(true)
            return
        else
            cb(false, "already_exist")
            return
        end
    else
        cb(false, "action_forbidden")
    end
end)

QBCore.Functions.CreateCallback("banking:server:TransfertOffshoreMoney", function(source, cb, accountTarget, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    local CurrentMoney = Player.Functions.GetMoney("marked_money")
    amount = tonumber(amount)

    if exports["soz-core"]:HasJobPermission(accountTarget, Player.PlayerData.job.id, Player.PlayerData.job.grade, "society-bank-account") then
        if amount <= CurrentMoney then
            if Player.Functions.RemoveMoney("marked_money", amount) then
                Account.AddMoney("offshore_" .. accountTarget, amount, "marked_money")
                cb(true)
                return
            end
        end
    else
        cb(false, "action_forbidden")
        return
    end

    cb(false, "unknown")
end)

QBCore.Functions.CreateCallback("banking:server:TransferMoney", function(source, cb, accountSource, accountTarget, amount, sendNotificationToTarget)
    local Player = QBCore.Functions.GetPlayer(source)
    local CurrentMoney = Player.Functions.GetMoney("money")
    amount = tonumber(amount)

    if accountSource == "player" then
        if amount <= CurrentMoney then
            if Player.Functions.RemoveMoney("money", amount) then
                Account.AddMoney(accountTarget, amount)

                exports["soz-core"]:Event("transfer_money", {
                    player_source = source,
                    accountSource = accountSource,
                    accountTarget = accountTarget,
                }, {money = amount})

                cb(true)
                return
            end
        end
    elseif accountTarget == "player" then
        local AccountMoney = Account(accountSource).money
        if amount <= AccountMoney then
            if Player.Functions.AddMoney("money", amount) then
                Account.RemoveMoney(accountSource, amount)

                exports["soz-core"]:Event("transfer_money", {
                    player_source = source,
                    accountSource = accountSource,
                    accountTarget = accountTarget,
                }, {money = amount})

                cb(true)
                return
            end
        end
    else
        Account.TransfertMoney(accountSource, accountTarget, amount, function(success, reason)
            if success and sendNotificationToTarget then
                local Target = QBCore.Functions.GetPlayerByBankAccount(accountTarget)
                local SourceJob = exports["soz-core"]:GetJob(accountSource)

                local Source = QBCore.Functions.GetPlayerByBankAccount(accountSource)
                local origin = Source and (Source.PlayerData.charinfo.firstname .. " " .. Source.PlayerData.charinfo.lastname) or SourceJob.label

                if Target then
                    TriggerClientEvent("soz-core:client:notification:draw-advanced", Target.PlayerData.source, "Maze Banque", "Mouvement bancaire",
                                       "Un virement de ~g~" .. amount .. "$~s~ de ~g~" .. origin .. "~s~ vient d'être versé sur votre compte",
                                       "CHAR_BANK_MAZE")
                end
            end

            cb(success, reason)
        end)
        return
    end

    cb(false, "unknown")
end)

RegisterNetEvent("banking:server:TransferMoney", function(accountSource, accountTarget, amount, cb)
    Account.TransfertMoney(accountSource, accountTarget, amount, function(success, reason)
        if cb then
            cb(success, reason)
        end
    end)
end)

RegisterNetEvent("banking:server:SafeStorageDeposit", function(money_type, safeStorage, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    local CurrentMoney = Player.Functions.GetMoney(money_type)
    amount = tonumber(amount)

    if money_type == "money" or money_type == "marked_money" then
        if amount <= CurrentMoney then
            if Player.Functions.RemoveMoney(money_type, amount) then
                local added = Account.AddMoney(safeStorage, amount, money_type)
                if added ~= false then
                    exports["soz-core"]:Event("safe_deposit", {
                        player_source = source,
                        safeStorage = safeStorage,
                        money_type = money_type,
                    }, {money = amount})

                    TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, ("Vous avez déposé ~g~$%s"):format(amount))
                else
                    Player.Functions.AddMoney(money_type, amount)
                    TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Le coffre n'a plus de place", "error")
                end
            end
        else
            TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Vous n'avez pas assez d'argent", "error")
        end
    end
end)

exports("AddMoney", function(safeStorage, amount, money_type, allowoverflow)
    return Account.AddMoney(safeStorage, amount, money_type, allowoverflow)
end)

RegisterNetEvent("banking:server:SafeStorageWithdraw", function(money_type, safeStorage, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    amount = tonumber(amount)

    if money_type == "money" or money_type == "marked_money" then
        local CurrentMoney = Account(safeStorage)[money_type]
        if amount <= CurrentMoney then
            if Player.Functions.AddMoney(money_type, amount) then
                Account.RemoveMoney(safeStorage, amount, money_type)

                exports["soz-core"]:Event("safe_withdraw", {
                    player_source = source,
                    safeStorage = safeStorage,
                    money_type = money_type,
                }, {money = amount})

                TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, ("Vous avez retiré ~g~$%s"):format(amount))
            end
        else
            TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Vous n'avez pas assez d'argent", "error")
        end
    end
end)

-- Source: Bank Account
-- Target: Player server id
exports("TransferCashMoney", function(source, target, amount, cb)
    local player = QBCore.Functions.GetPlayer(target)
    amount = tonumber(amount)
    local money_type = "money"

    local CurrentMoney = Account(source)[money_type]
    if amount <= CurrentMoney then
        if player.Functions.AddMoney(money_type, amount) then
            Account.RemoveMoney(source, amount, money_type)
            cb(true)
        else
            cb(false, "could_not_add_money")
        end
    else
        TriggerClientEvent("soz-core:client:notification:draw", player.PlayerData.source, "Vous n'avez pas assez d'argent", "error")
        cb(false, "insufficient_funds")
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
QBCore.Functions.CreateCallback("banking:server:openHouseSafeStorage", function(source, cb, safeStorage)
    local player = QBCore.Functions.GetPlayer(source)
    if not player then
        return
    end

    local inside = player.PlayerData.metadata.inside
    local apartmentTier = exports["soz-housing"]:GetApartmentTier(inside.property, inside.apartment)
    local account = Account(safeStorage)

    if account == nil then
        account = Account.Create(safeStorage, safeStorage, "house_safe", safeStorage)
    end

    if Account.AccessGranted(account, source) then
        account.max = Config.HouseSafeTiers[apartmentTier]
        cb(true, account.money, account.marked_money, account.max)
    else
        cb(false)
    end
end)

RegisterNetEvent("banking:server:updatePhoneBalance", function()
    local Player = QBCore.Functions.GetPlayer(source)
    local account = Account(Player.PlayerData.charinfo.account)

    TriggerClientEvent("phone:client:app:bank:updateBalance", Player.PlayerData.source, Player.Functions.GetName(), account.id, account.money)
end)

exports("GetPlayerAccount", function(source)
    local Player = QBCore.Functions.GetPlayer(source)
    local account = Account(Player.PlayerData.charinfo.account)

    return {name = Player.Functions.GetName(), account = account.id, balance = account.money}
end)
