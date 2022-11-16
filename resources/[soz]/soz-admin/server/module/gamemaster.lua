RegisterNetEvent("admin:gamemaster:giveMoney", function(moneyType, amount)
    if not SozAdmin.Functions.IsPlayerAdmin(source) then
        return
    end

    local player = QBCore.Functions.GetPlayer(source)
    if player and moneyType and amount then
        player.Functions.AddMoney(moneyType, tonumber(amount))
    end
end)

RegisterNetEvent("admin:gamemaster:giveLicence", function(licence)
    if not SozAdmin.Functions.IsPlayerAdmin(source) then
        return
    end

    local player = QBCore.Functions.GetPlayer(source)
    if player and licence then
        player.Functions.SetLicence(licence, 12)
    end
end)

RegisterNetEvent("admin:gamemaster:unCuff", function()
    if not SozAdmin.Functions.IsPlayerHelper(source) then
        return
    end

    local player = QBCore.Functions.GetPlayer(source)
    if player then
        player.Functions.SetMetaData("ishandcuffed", false)
        Player(source).state:set("ishandcuffed", false, true)
        TriggerClientEvent("police:client:GetUnCuffed", source)
    end
end)

RegisterNetEvent("admin:gamemaster:godmode", function(val)
    local playerSource = source

    if not SozAdmin.Functions.IsPlayerAdmin(playerSource) then
        return
    end

    local godmode = not not val

    SetPlayerInvincible(playerSource, godmode)
    local player = QBCore.Functions.GetPlayer(playerSource)
    player.Functions.SetMetaData("godmode", godmode)
end)
