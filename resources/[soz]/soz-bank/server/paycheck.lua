function NotifyPaycheck(playerID)
    TriggerClientEvent("hud:client:DrawAdvancedNotification", playerID, "Maze Banque", "Mouvement bancaire",
                       "Un versement vient d'être réalisé sur votre compte", "CHAR_BANK_MAZE", 9)
end

function PaycheckLoop()
    local Players = QBCore.Functions.GetQBPlayers()
    for _, Player in pairs(Players) do
        local grade = Player.PlayerData.job.grade or {}
        local payment = grade.salary or 0

        if Player.PlayerData.metadata["injail"] == 0 and Player.PlayerData.job and payment > 0 then
            if Player.PlayerData.job.id == "unemployed" then
                Account.AddMoney(Player.PlayerData.charinfo.account, payment)
                NotifyPaycheck(Player.PlayerData.source)
            else
                Account.TransfertMoney(Player.PlayerData.job.id, Player.PlayerData.charinfo.account, payment, function(success, reason)
                    if success then
                        NotifyPaycheck(Player.PlayerData.source)
                    else
                        print(reason)
                    end
                end)
            end
        end
    end
    SetTimeout(Config.PayCheckTimeOut * (60 * 1000), PaycheckLoop)
end

PaycheckLoop()
