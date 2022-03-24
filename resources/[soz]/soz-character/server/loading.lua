QBCore.Functions.CreateCallback("soz-character:server:GetDefaultPlayer", function(source, cb)
    local license = QBCore.Functions.GetIdentifier(source, "license")
    local character = MySQL.single.await("SELECT * FROM player WHERE license = ? AND is_default = 1 LIMIT 1", {license})

    cb(character)
end)

QBCore.Functions.CreateCallback("soz-character:server:LoginPlayer", function(source, cb, player)
    if QBCore.Player.Login(source, player.citizenid) then
        exports["soz-monitor"]:Log("INFO", "Player has successfully loaded !", player)
        QBCore.Commands.Refresh(source)

        cb(QBCore.Functions.GetPlayer(source))
    else
        cb(nil)
    end
end)

RegisterNetEvent("soz-character:server:LoginPlayer", function(player)
    local src = source

    if QBCore.Player.Login(src, player.citizenid) then
        exports["soz-monitor"]:Log("INFO", "Player has successfully loaded !", player)

        QBCore.Commands.Refresh(src)
    end
end)
