QBCore.Functions.CreateCallback("soz-character:server:GetUserTempPlayer", function(source, cb)
    local license = QBCore.Functions.GetIdentifier(source, "license")

    cb(MySQL.single.await("SELECT * FROM player_temp WHERE license = ? LIMIT 1", {license}))
end)

QBCore.Functions.CreateCallback("soz-character:server:CreatePlayer", function(source, cb, charinfo, skin, clothConfig)
    local player = {charinfo = charinfo, skin = skin, cloth_config = clothConfig}

    if QBCore.Player.Login(source, false, player) then
        exports["soz-monitor"]:Log("INFO", GetPlayerName(source) .. " has succesfully loaded!")
        QBCore.Commands.Refresh(source)

        cb(true)
    else
        cb(false)
    end
end)

RegisterServerEvent("soz-character:server:SetGodmode")
AddEventHandler("soz-character:server:SetGodmode", function(source, val)
    local Player = QBCore.Functions.GetPlayer(source)
    Player.Functions.SetMetaData("godmode", val)
end)
