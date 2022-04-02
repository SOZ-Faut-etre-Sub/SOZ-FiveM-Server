local giveAnimation = function(src)
    TaskPlayAnim(GetPlayerPed(src), "mp_common", "givetake1_a", 8.0, -8.0, -1, 49, 0, true, true, true)
end

QBCore.Functions.CreateCallback("inventory:server:openPlayerInventory", function(source, cb, type, id)
    local ply = Player(source)
    local Player = QBCore.Functions.GetPlayer(source)

    if not ply.state.inv_busy then
        cb(Inventory(Player.PlayerData.source))
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Inventaire en cours d'utilisation")
        cb(nil)
    end
end)

RegisterNetEvent("inventory:server:UseItemSlot", function(slot)
    local Player = QBCore.Functions.GetPlayer(source)
    local itemData = Player.Functions.GetItemBySlot(slot)

    if itemData ~= nil then
        if itemData.type == "weapon" then
            if itemData.metadata.quality ~= nil then
                if itemData.metadata.quality > 0 then
                    TriggerClientEvent("inventory:client:UseWeapon", Player.PlayerData.source, itemData, true)
                else
                    TriggerClientEvent("inventory:client:UseWeapon", Player.PlayerData.source, itemData, false)
                end
            else
                TriggerClientEvent("inventory:client:UseWeapon", Player.PlayerData.source, itemData, true)
            end
        elseif itemData.useable then
            TriggerClientEvent("QBCore:Client:UseItem", Player.PlayerData.source, itemData)
        end
    end
end)

RegisterServerEvent("inventory:server:GiveItem", function(target, item, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    local Target = QBCore.Functions.GetPlayer(tonumber(target))
    local dist = #(GetEntityCoords(GetPlayerPed(Player.PlayerData.source)) - GetEntityCoords(GetPlayerPed(Target.PlayerData.source)))

    if Player == Target then
        return
    end
    if dist > 2 then
        return TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Personne n'est à portée de vous")
    end

    if amount <= item.amount then
        if amount == 0 then
            amount = item.amount
        end

        Inventory.TransfertItem(Player.PlayerData.source, Target.PlayerData.source, item.name, amount, item.metadata, item.slot, function(success, reason)
            if success then
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, string.format("Vous avez donné ~o~%s ~b~%s", amount, item.label))
                TriggerClientEvent("hud:client:DrawNotification", Target.PlayerData.source, string.format("Vous avez reçu ~o~%s ~b~%s", amount, item.label))

                giveAnimation(Player.PlayerData.source)
                giveAnimation(Target.PlayerData.source)
            else
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~r~Vous ne pouvez pas donner cet objet !")
                TriggerClientEvent("hud:client:DrawNotification", Target.PlayerData.source, "~r~Vous ne pouvez pas recevoir d'objet !")
            end
        end)
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~r~Vous ne possédez pas le nombre d'items requis pour le transfert")
    end
end)

RegisterServerEvent("inventory:server:GiveMoney", function(target, moneyType, amount)
    if moneyType ~= "money" and moneyType ~= "marked_money" then
        return
    end

    local Player = QBCore.Functions.GetPlayer(source)
    local Target = QBCore.Functions.GetPlayer(tonumber(target))
    local dist = #(GetEntityCoords(GetPlayerPed(Player.PlayerData.source)) - GetEntityCoords(GetPlayerPed(Target.PlayerData.source)))

    if Player == Target then
        return
    end
    if dist > 2 then
        return TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Personne n'est à portée de vous")
    end

    local moneyAmount = Player.Functions.GetMoney("money")
    local moneyMarkedAmount = Player.Functions.GetMoney("marked_money")

    if (moneyAmount + moneyMarkedAmount) >= amount then
        local moneyTake = 0
        local markedMoneyTake = 0

        if moneyType == "money" then
            if moneyAmount < amount then
                moneyTake = moneyAmount
                markedMoneyTake = amount - moneyAmount
            else
                moneyTake = amount
            end
        elseif moneyType == "marked_money" then
            if moneyMarkedAmount < amount then
                moneyTake = amount - moneyMarkedAmount
                markedMoneyTake = moneyMarkedAmount
            else
                markedMoneyTake = amount
            end
        end

        Player.Functions.RemoveMoney("money", moneyTake)
        Player.Functions.RemoveMoney("marked_money", markedMoneyTake)
        Target.Functions.AddMoney("money", moneyTake)
        Target.Functions.AddMoney("marked_money", markedMoneyTake)

        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, string.format("Vous avez donné ~r~%s$", amount))
        TriggerClientEvent("hud:client:DrawNotification", Target.PlayerData.source, string.format("Vous avez reçu ~g~%s$", amount))

        giveAnimation(Player.PlayerData.source)
        giveAnimation(Target.PlayerData.source)
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~r~Vous ne possédez pas l'argent requis pour le transfert")
    end
end)
