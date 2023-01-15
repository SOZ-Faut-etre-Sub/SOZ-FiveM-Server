QBCore.Functions.CreateCallback("soz-character:server:GetDefaultPlayer", function(source, cb)
    local steam = QBCore.Functions.GetSozIdentifier(source)
    local character = MySQL.single.await("SELECT * FROM player WHERE license = ? AND is_default = 1 ORDER BY created_at ASC LIMIT 1", {
        steam,
    })

    cb(character)
end)

QBCore.Functions.CreateCallback("soz-character:server:LoginPlayer", function(source, cb, player)
    if QBCore.Player.Login(source, player.citizenid) then
        QBCore.Commands.Refresh(source)

        TriggerEvent("monitor:server:event", "player_login", {player_source = source}, {})

        cb(QBCore.Functions.GetPlayer(source))
    else
        cb(nil)
    end
end)
