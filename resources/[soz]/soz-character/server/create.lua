local function GiveStarterItems(source)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    for _, starterItem in pairs(QBCore.Shared.StarterItems) do
        local metadata = {}

        if starterItem.item == "id_card" then
            metadata.citizenid = Player.PlayerData.citizenid
            metadata.firstname = Player.PlayerData.charinfo.firstname
            metadata.lastname = Player.PlayerData.charinfo.lastname
            metadata.birthdate = Player.PlayerData.charinfo.birthdate
            metadata.gender = Player.PlayerData.charinfo.gender
            metadata.nationality = Player.PlayerData.charinfo.nationality
        elseif starterItem.item == "driver_license" then
            metadata.firstname = Player.PlayerData.charinfo.firstname
            metadata.lastname = Player.PlayerData.charinfo.lastname
            metadata.birthdate = Player.PlayerData.charinfo.birthdate
            metadata.type = "Class C Driver License"
        end

        exports["soz-inventory"]:AddItem(Player.PlayerData.source, starterItem.item, starterItem.amount, false, metadata)
    end
end

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
        GiveStarterItems(src)
    end
end)
