local lib, anim = "anim@mp_atm@enter", "enter"

-- In-memory table storing last use of any bank or ATM
-- This is used to limit chained money withdrawals (withdrawal only)
local UsedBankAtm = {}

local function getATMOrBankAccount(atm, bank)
    if atm and string.match(atm, "atm_ent_%w+") then
        return atm
    end
    return bank
end

RegisterNUICallback("createOffshoreAccount", function(data, cb)
    QBCore.Functions.TriggerCallback("banking:server:createOffshoreAccount", function(success, reason)
        if success then
            exports["soz-core"]:DrawAdvancedNotification("Maze Banque", "Création de compte", "Vous avez crée un nouveau compte", "CHAR_BANK_MAZE")
        else
            exports["soz-core"]:DrawNotification(Config.ErrorMessage[reason], "error")
        end
        openBankScreen(data.account)
    end, data.account)
end)

RegisterNUICallback("doOffshoreDeposit", function(data, cb)
    local amount = tonumber(data.amount)

    if amount ~= nil and amount > 0 then
        QBCore.Functions.TriggerCallback("banking:server:TransfertOffshoreMoney", function(success, reason)
            if success then
                exports["soz-core"]:DrawAdvancedNotification("Maze Banque", "Dépot: ~g~" .. amount .. "$", "Vous avez déposé de l'argent", "CHAR_BANK_MAZE")
            else
                exports["soz-core"]:DrawNotification(Config.ErrorMessage[reason], "error")
            end
            openBankScreen(data.account)
        end, data.account, amount)
    end
end)

RegisterNUICallback("doWithdraw", function(data, cb)
    local amount = tonumber(data.amount)
    local terminalType = QBCore.Functions.TriggerRpc("banking:server:GetTerminalType", data.bankAtmAccount, data.atmType)
    local terminalConfig = Config.BankAtmDefault[terminalType]
    local lastUse

    if terminalConfig.maxWithdrawal then
        if amount > terminalConfig.maxWithdrawal then
            exports["soz-core"]:DrawNotification(string.format(Config.ErrorMessage["max_widthdrawal_limit"], terminalConfig.maxWithdrawal), "error")
            return
        end

        lastUse = UsedBankAtm[data.atmName or data.bankAtmAccount]
        if lastUse ~= nil then
            local amountAvailableForWithdraw = terminalConfig.maxWithdrawal - lastUse.amountWithdrawn
            local remainingTime = terminalConfig.limit + lastUse.lastUsed - GetGameTimer()

            local limit = string.format(Config.ErrorMessage["limit"], terminalConfig.maxWithdrawal, math.ceil(terminalConfig.limit / 60000))
            if remainingTime > 0 then
                if amountAvailableForWithdraw == 0 then
                    exports["soz-core"]:DrawNotification(limit .. string.format(Config.ErrorMessage["time_limit"], math.ceil(remainingTime / 60000)), "error")
                    return
                elseif amount > amountAvailableForWithdraw then
                    exports["soz-core"]:DrawNotification(limit .. string.format(Config.ErrorMessage["withdrawal_limit"], amountAvailableForWithdraw), "error")
                    return
                end
            end
        end
    end

    local p = promise.new()
    QBCore.Functions.TriggerCallback("banking:server:hasEnoughLiquidity", function(result, reason)
        if not result then
            if reason == "invalid_liquidity" then
                exports["soz-core"]:DrawNotification(Config.ErrorMessage[reason], "error")
            else
                exports["soz-core"]:DrawNotification(Config.ErrorMessage["unknown"], "error")
            end
        end
        return p:resolve(result)
    end, getATMOrBankAccount(data.atmName, data.bankAtmAccount), amount)
    local hasEnoughLiquidity = Citizen.Await(p)
    if not hasEnoughLiquidity then
        return
    end

    if amount ~= nil and amount > 0 then
        QBCore.Functions.TriggerCallback("banking:server:TransferMoney", function(success, reason)
            if success then
                exports["soz-core"]:DrawAdvancedNotification("Maze Banque", "Retrait: ~r~" .. amount .. "$", "Vous avez retiré de l'argent", "CHAR_BANK_MAZE")
                TriggerServerEvent("banking:server:RemoveLiquidity", data.bankAtmAccount, amount)
                local newAmount = amount
                if lastUse and lastUse.amountWithdrawn then
                    if lastUse.amountWithdrawn == terminalConfig.maxWithdrawal then
                        lastUse.amountWithdrawn = 0
                    end
                    newAmount = amount + lastUse.amountWithdrawn
                end
                UsedBankAtm[data.atmName or data.bankAtmAccount] = {
                    lastUsed = GetGameTimer(),
                    amountWithdrawn = newAmount,
                }
            else
                exports["soz-core"]:DrawNotification(Config.ErrorMessage[reason], "error")
            end
            openBankScreen(data.account, data.isATM, data.bankAtmAccount, data.atmType, data.atmName)
        end, data.account, "player", amount)
    end
end)

RegisterNUICallback("doTransfer", function(data, cb)
    local amount = tonumber(data.amount)

    if amount ~= nil and amount > 0 then
        QBCore.Functions.TriggerCallback("banking:server:TransferMoney", function(success, reason)
            if success then
                exports["soz-core"]:DrawAdvancedNotification("Maze Banque", "Transfert: ~r~" .. amount .. "$",
                    "Vous avez transféré de l'argent sur un compte", "CHAR_BANK_MAZE")
            else
                exports["soz-core"]:DrawNotification(Config.ErrorMessage[reason], "error")
            end
            openBankScreen(data.accountSource)
        end, data.accountSource, data.accountTarget, amount, true)
    end
end)
