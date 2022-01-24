local function openBankScreen(account)
    QBCore.Functions.TriggerCallback("banking:getBankingInformation", function(banking)
        if banking ~= nil then
            SetNuiFocus(true, true)
            SendNUIMessage({status = "openbank", information = banking})
        end
    end, account)
end

RegisterNetEvent("banking:openBankScreen", function()
    openBankScreen()
end)

RegisterNetEvent("banking:openSocietyBankScreen", function()
    openBankScreen(PlayerData.job.name)
end)

RegisterNUICallback("NUIFocusOff", function(data, cb)
    SetNuiFocus(false, false)
    SendNUIMessage({status = "closebank"})
end)

RegisterNUICallback("doDeposit", function(data, cb)
    local amount = tonumber(data.amount)

    if amount ~= nil and amount > 0 then
        QBCore.Functions.TriggerCallback("banking:server:TransfertMoney", function(success, reason)
            if success then
                exports["soz-hud"]:DrawAdvancedNotification("Maze Banque", "Dépot: ~g~" .. amount .. "$", "Vous avez déposé de l'argent", "CHAR_BANK_MAZE", 9)
            else
                exports["soz-hud"]:DrawNotification(Config.ErrorMessage[reason])
            end
            openBankScreen(data.account)
        end, "player", data.account, amount)
    end
end)

RegisterNUICallback("doWithdraw", function(data, cb)
    local amount = tonumber(data.amount)

    if amount ~= nil and amount > 0 then
        QBCore.Functions.TriggerCallback("banking:server:TransfertMoney", function(success, reason)
            if success then
                exports["soz-hud"]:DrawAdvancedNotification("Maze Banque", "Retrait: ~r~" .. amount .. "$", "Vous avez retiré de l'argent", "CHAR_BANK_MAZE", 9)
            else
                exports["soz-hud"]:DrawNotification(Config.ErrorMessage[reason])
            end
            openBankScreen(data.account)
        end, data.account, "player", amount)
    end
end)

RegisterNUICallback("doTransfer", function(data, cb)
    local amount = tonumber(data.amount)

    if amount ~= nil and amount > 0 then
        QBCore.Functions.TriggerCallback("banking:server:TransfertMoney", function(success, reason)
            if success then
                exports["soz-hud"]:DrawAdvancedNotification("Maze Banque", "Transfert: ~r~" .. amount .. "$", "Vous avez transférer de l'argent sur un compte",
                                                            "CHAR_BANK_MAZE", 9)
            else
                exports["soz-hud"]:DrawNotification(Config.ErrorMessage[reason])
            end
            openBankScreen(data.accountSource)
        end, data.accountSource, data.accountTarget, amount)
    end
end)
