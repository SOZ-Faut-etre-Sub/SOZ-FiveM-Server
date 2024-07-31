local lib, anim = "anim@mp_atm@enter", "enter"

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
