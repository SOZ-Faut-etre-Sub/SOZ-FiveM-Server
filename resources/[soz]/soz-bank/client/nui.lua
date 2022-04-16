local lib, anim = "anim@mp_atm@enter", "enter"

local function playAnimation()
    if not IsNuiFocused() then
        QBCore.Functions.RequestAnimDict(lib)
        TaskPlayAnim(PlayerPedId(), lib, anim, 8.0, -8.0, -1, 0, 0.0, true, true, true)
        Wait(3000)
    end
end

local function openBankScreen(account, isATM)
    QBCore.Functions.TriggerCallback("banking:getBankingInformation", function(banking)
        if banking ~= nil then
            playAnimation()

            SetNuiFocus(true, true)
            SendNUIMessage({status = "openbank", information = banking, isATM = isATM})
        end
    end, account)
end

RegisterNetEvent("banking:openBankScreen", function()
    openBankScreen()
end)

RegisterNetEvent("banking:openATMScreen", function(data)
    QBCore.Functions.TriggerCallback("banking:server:getAtmMoney", function()
        -- TODO
        openBankScreen(nil, true)
    end, data.atmType, GetEntityCoords(data.entity))
end)

RegisterNetEvent("banking:openSocietyBankScreen", function()
    openBankScreen(PlayerData.job.id)
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
        QBCore.Functions.TriggerCallback("banking:server:TransfertMoney", function(success, reason)
            if success then
                exports["soz-hud"]:DrawAdvancedNotification("Maze Banque", "Dépot: ~g~" .. amount .. "$", "Vous avez déposé de l'argent", "CHAR_BANK_MAZE")
            else
                exports["soz-hud"]:DrawNotification(Config.ErrorMessage[reason], "error")
            end
            openBankScreen(data.account)
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

    if amount ~= nil and amount > 0 then
        QBCore.Functions.TriggerCallback("banking:server:TransfertMoney", function(success, reason)
            if success then
                exports["soz-hud"]:DrawAdvancedNotification("Maze Banque", "Retrait: ~r~" .. amount .. "$", "Vous avez retiré de l'argent", "CHAR_BANK_MAZE")
            else
                exports["soz-hud"]:DrawNotification(Config.ErrorMessage[reason], "error")
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
                                                            "CHAR_BANK_MAZE")
            else
                exports["soz-hud"]:DrawNotification(Config.ErrorMessage[reason], "error")
            end
            openBankScreen(data.accountSource)
        end, data.accountSource, data.accountTarget, amount)
    end
end)
