QBCore.Functions.CreateCallback("soz-character:server:GetDefaultPlayer", function(source, cb)
    local steam = QBCore.Functions.GetSozIdentifier(source)
    local character = MySQL.single.await("SELECT * FROM player WHERE license = ? AND is_default = 1 ORDER BY last_updated DESC LIMIT 1", {
        steam,
    })

    cb(character)
end)

QBCore.Functions.CreateCallback("soz-character:server:LoginPlayer", function(source, cb, player)
    if QBCore.Player.Login(source, player.citizenid) then
        Wait(0)
        QBCore.Commands.Refresh(source)

        local license = GetPlayerIdentifierByType(source, "license")
        local license2 = GetPlayerIdentifierByType(source, "license2")

        exports["soz-core"]:TraceEvent("player_login", {
            player_source = source,
            id = source,
            license = license,
            license2 = license2,
        })

        cb(QBCore.Functions.GetPlayer(source))
    else
        cb(nil)
    end
end)
