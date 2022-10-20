local lib, anim = "anim@mp_atm@enter", "enter"

-- In-memory table storing last use of any bank or ATM
-- This is used to limit chained money withdrawals (withdrawal only)
local UsedBankAtm = {}

local function playAnimation()
    if not IsNuiFocused() then
        QBCore.Functions.RequestAnimDict(lib)
        TaskPlayAnim(PlayerPedId(), lib, anim, 8.0, -8.0, -1, 0, 0.0, true, true, true)
        Wait(3000)
    end
end

local function openBankScreen(account, isATM, bankAtmAccountId, atmType, atmName)
    QBCore.Functions.TriggerCallback("banking:getBankingInformation", function(banking)
        if banking ~= nil then
            playAnimation()

            SetNuiFocus(true, true)
            SendNUIMessage({
                status = "openbank",
                information = banking,
                isATM = isATM,
                atmType = atmType,
                atmName = atmName,
                bankAtmAccount = bankAtmAccountId,
            })
        end
    end, account)
end

RegisterNetEvent("banking:openBankScreen", function()
    local currentBank = exports["soz-bank"]:GetCurrentBank()
    local accountId = QBCore.Functions.TriggerRpc("banking:server:getBankAccount", currentBank.bank)
    openBankScreen(nil, false, accountId)
end)

RegisterNetEvent("banking:openATMScreen", function(data)
    local atm = QBCore.Functions.TriggerRpc("banking:server:getAtmAccount", data.atmType, GetEntityCoords(data.entity))
    openBankScreen(nil, true, atm.account, data.atmType, atm.name)
end)

RegisterNetEvent("banking:openSocietyBankScreen", function()
    local currentBank = exports["soz-bank"]:GetCurrentBank()
    local accountId = QBCore.Functions.TriggerRpc("banking:server:getBankAccount", currentBank.bank)
    openBankScreen(PlayerData.job.id, false, accountId)
end)

RegisterNUICallback("NUIFocusOff", function(data, cb)
    SetNuiFocus(false, false)
    SendNUIMessage({status = "closebank"})
    playAnimation()
end)

RegisterNUICallback("createOffshoreAccount", function(data, cb)
    QBCore.Functions.TriggerCallback("banking:server:createOffshoreAccount", function(success, reason)
        if success then
            exports["soz-hud"]:DrawAdvancedNotification("Maze Banque", "Création de compte", "Vous avez crée un nouveau compte", "CHAR_BANK_MAZE")
        else
            exports["soz-hud"]:DrawNotification(Config.ErrorMessage[reason], "error")
        end
        openBankScreen(data.account)
    end, data.account)
end)

RegisterNUICallback("doDeposit", function(data, cb)
    local amount = tonumber(data.amount)

    if amount ~= nil and amount > 0 then
        QBCore.Functions.TriggerCallback("banking:server:TransferMoney", function(success, reason)
            if success then
                exports["soz-hud"]:DrawAdvancedNotification("Maze Banque", "Dépot: ~g~" .. amount .. "$", "Vous avez déposé de l'argent", "CHAR_BANK_MAZE")
            else
                exports["soz-hud"]:DrawNotification(Config.ErrorMessage[reason], "error")
            end
            openBankScreen(data.account, data.isATM, data.bankAtmAccount, data.atmType, data.atmName)
        end, "player", data.account, amount)
    end
end)

RegisterNUICallback("doOffshoreDeposit", function(data, cb)
    local amount = tonumber(data.amount)

    if amount ~= nil and amount > 0 then
        QBCore.Functions.TriggerCallback("banking:server:TransfertOffshoreMoney", function(success, reason)
            if success then
                exports["soz-hud"]:DrawAdvancedNotification("Maze Banque", "Dépot: ~g~" .. amount .. "$", "Vous avez déposé de l'argent", "CHAR_BANK_MAZE")
            else
                exports["soz-hud"]:DrawNotification(Config.ErrorMessage[reason], "error")
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
            exports["soz-hud"]:DrawNotification(string.format(Config.ErrorMessage["max_widthdrawal_limit"], terminalConfig.maxWithdrawal), "error")
            return
        end

        lastUse = UsedBankAtm[data.atmName or data.bankAtmAccount]
        if lastUse ~= nil then
            local amountAvailableForWithdraw = terminalConfig.maxWithdrawal - lastUse.amountWithdrawn
            local remainingTime = terminalConfig.limit + lastUse.lastUsed - GetGameTimer()

            local limit = string.format(Config.ErrorMessage["limit"], terminalConfig.maxWithdrawal, math.ceil(terminalConfig.limit / 60000))
            if remainingTime > 0 then
                if amountAvailableForWithdraw == 0 then
                    exports["soz-hud"]:DrawNotification(limit .. string.format(Config.ErrorMessage["time_limit"], math.ceil(remainingTime / 60000)), "error")
                    return
                elseif amount > amountAvailableForWithdraw then
                    exports["soz-hud"]:DrawNotification(limit .. string.format(Config.ErrorMessage["withdrawal_limit"], amountAvailableForWithdraw), "error")
                    return
                end
            end
        end

        local p = promise.new()
        QBCore.Functions.TriggerCallback("banking:server:hasEnoughLiquidity", function(result, reason)
            if not result then
                if reason == "invalid_liquidity" then
                    exports["soz-hud"]:DrawNotification(Config.ErrorMessage[reason], "error")
                else
                    exports["soz-hud"]:DrawNotification(Config.ErrorMessage["unknown"], "error")
                end
            end
            return p:resolve(result)
        end, data.atmName or data.bankAtmAccount, amount)
        local hasEnoughLiquidity = Citizen.Await(p)
        if not hasEnoughLiquidity then
            return
        end
    end

    if amount ~= nil and amount > 0 then
        QBCore.Functions.TriggerCallback("banking:server:TransferMoney", function(success, reason)
            if success then
                exports["soz-hud"]:DrawAdvancedNotification("Maze Banque", "Retrait: ~r~" .. amount .. "$", "Vous avez retiré de l'argent", "CHAR_BANK_MAZE")
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
                exports["soz-hud"]:DrawNotification(Config.ErrorMessage[reason], "error")
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
                exports["soz-hud"]:DrawAdvancedNotification("Maze Banque", "Transfert: ~r~" .. amount .. "$", "Vous avez transférer de l'argent sur un compte",
                                                            "CHAR_BANK_MAZE")
            else
                exports["soz-hud"]:DrawNotification(Config.ErrorMessage[reason], "error")
            end
            openBankScreen(data.accountSource)
        end, data.accountSource, data.accountTarget, amount, true)
    end
end)
