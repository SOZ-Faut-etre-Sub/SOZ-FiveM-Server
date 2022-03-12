QBCore.Functions.CreateCallback("soz-character:server:GetDefaultPlayer", function(source, cb)
    local license = QBCore.Functions.GetIdentifier(source, "license")
    local character = MySQL.single.await("SELECT * FROM players WHERE license = ? AND is_default = 1 LIMIT 1", {license})

    cb(character)
end)

QBCore.Functions.CreateCallback("soz-character:server:GetPlayerSkin", function(source, cb, citizenId)
    local skin = MySQL.single.await("SELECT * FROM playerskins WHERE citizenid = ? AND active = 1 LIMIT 1", {citizenId})

    cb(skin)
end)

RegisterNetEvent("soz-character:server:LoginPlayer", function(player)
    local src = source

    if QBCore.Player.Login(src, player.citizenid) then
        exports["soz-monitor"]:Log("INFO", "Player has successfully loaded !", player)

        QBCore.Commands.Refresh(src)
    end
end)
