QBCore.Functions.CreateCallback("soz-character:server:GetUserAccount", function(source, cb)
    local account = QBCore.Functions.GetUserAccount(source)

    if account then
        if not GetConvar("soz_allow_anonymous_login", "false") == "true" then
            DropPlayer(source, "no account found with this steam id")
        else
            cb(nil)
        end
    else
        cb(account)
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

RegisterNetEvent("soz-character:server:set-skin", function(skin, clothConfig)
    local Player = QBCore.Functions.GetPlayer(source)

    Player.Functions.SetSkin(skin, false)
    Player.Functions.SetClothConfig(clothConfig, false)
end)

RegisterNetEvent("soz-character:server:InCharacterMenu", function(inMenu)
    if inMenu then
        QBCore.Functions.SetPlayerBucket(source, source)
    else
        QBCore.Functions.SetPlayerBucket(source, 0)
    end
end)
