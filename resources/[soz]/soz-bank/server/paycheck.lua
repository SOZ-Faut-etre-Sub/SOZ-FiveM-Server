function NotifyPaycheck(playerID)
    TriggerClientEvent("hud:client:DrawAdvancedNotification", playerID, "Maze Banque", "Mouvement bancaire",
                       "Un versement vient d'être réalisé sur votre compte", "CHAR_BANK_MAZE")
end

function PaycheckLoop()
    local Players = QBCore.Functions.GetQBPlayers()
    local SozJobCore = exports["soz-jobs"]:GetCoreObject()

    for _, Player in pairs(Players) do
        local grade = SozJobCore.Jobs[Player.PlayerData.job.id].grades[tostring(Player.PlayerData.job.grade)] or {}
        local payment = grade.salary or 0

        if Player.PlayerData.metadata["injail"] == 0 and Player.PlayerData.job and payment > 0 then
            if Player.PlayerData.job.id == SozJobCore.JobType.Unemployed then
                Account.AddMoney(Player.PlayerData.charinfo.account, payment)
                NotifyPaycheck(Player.PlayerData.source)

                TriggerEvent("monitor:server:event", "paycheck", {player_source = Player.PlayerData.source}, {
                    amount = tonumber(payment),
                })
            else
                if not Player.PlayerData.job.onduty then
                    payment = math.ceil(payment * 30 / 100)
                end

                Account.TransfertMoney(Player.PlayerData.job.id, Player.PlayerData.charinfo.account, payment, function(success, reason)
                    if success then
                        NotifyPaycheck(Player.PlayerData.source)

                        TriggerEvent("monitor:server:event", "paycheck", {player_source = Player.PlayerData.source}, {
                            amount = tonumber(payment),
                        })
                    else
                        print(reason)
                    end
                end)
            end
        end
    end
    SetTimeout(Config.PayCheckTimeOut * (60 * 1000), PaycheckLoop)
end

Citizen.CreateThread(function()
    SetTimeout(Config.PayCheckTimeOut * (60 * 1000), PaycheckLoop)
end)
