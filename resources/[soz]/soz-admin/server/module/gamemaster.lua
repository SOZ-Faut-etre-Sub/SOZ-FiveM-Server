RegisterNetEvent("admin:gamemaster:giveMoney", function(moneyType, amount)
    if not CheckIsAdminMenuIsAvailable(source) then
        return
    end

    local player = QBCore.Functions.GetPlayer(source)
    if player and moneyType and amount then
        player.Functions.AddMoney(moneyType, tonumber(amount))
    end
end)

RegisterNetEvent("admin:gamemaster:unCuff", function(moneyType, amount)
    if not CheckIsAdminMenuIsAvailable(source) then
        return
    end

    local player = QBCore.Functions.GetPlayer(source)
    if player and moneyType and amount then
        player.Functions.SetMetaData("ishandcuffed", false)
    end
end)
