QBCore.Functions.CreateCallback("soz-character:server:GetUserTempPlayer", function(source, cb)
    local license = QBCore.Functions.GetIdentifier(source, "license")

    cb(MySQL.single.await("SELECT * FROM player_temp WHERE license = ? LIMIT 1", {license}))
end)

RegisterNetEvent("soz-character:server:CreatePlayer", function(charinfo)
    local src = source
    local player = {charinfo = charinfo}

    if QBCore.Player.Login(src, false, player) then
        exports["soz-monitor"]:Log("INFO", GetPlayerName(src) .. " has succesfully loaded!")
        QBCore.Commands.Refresh(src)

        TriggerClientEvent("soz-character:client:ChoosePlayerSkin", src)
    end
end)
