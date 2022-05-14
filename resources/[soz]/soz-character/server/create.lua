QBCore.Functions.CreateCallback("soz-character:server:GetUserAccount", function(source, cb)
    local steam = QBCore.Functions.GetSozIdentifier(source)
    local status, result = pcall(function()
        return MySQL.single.await(
                   "SELECT a.* FROM soz_api.accounts a LEFT JOIN soz_api.account_identities ai ON a.id = ai.accountId WHERE ai.identityType = 'STEAM' AND ai.identityId = ? LIMIT 1",
                   {steam})
    end)

    if not status or not result then
        exports["soz-monitor"]:Log("ERROR", GetPlayerName(source) .. " error finding account for this user: " .. json.encode(result),
                                   {steam = steam, callback = "soz-character:server:GetUserAccount"})

        if not GetConvar("soz_allow_anonymous_login", "false") == "true" then
            DropPlayer(source, "no account found with this steam id")
        else
            cb(nil)
        end
    else
        cb(result)
    end
end)

QBCore.Functions.CreateCallback("soz-character:server:CreatePlayer", function(source, cb, charinfo, skin, clothConfig)
    local player = {charinfo = charinfo, skin = skin, cloth_config = clothConfig}

    if QBCore.Player.Login(source, false, player) then
        QBCore.Commands.Refresh(source)
        TriggerEvent("monitor:server:event", "player_login", {player_source = source}, {})

        for _, item in pairs(Config.NewPlayerDefaultItems) do
            exports["soz-inventory"]:AddItem(source, item.name, item.quantity, false, false)
        end

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

RegisterNetEvent("soz-character:server:InCharacterMenu", function(inMenu)
    if inMenu then
        QBCore.Functions.SetPlayerBucket(source, source)
    else
        QBCore.Functions.SetPlayerBucket(source, 0)
    end
end)
