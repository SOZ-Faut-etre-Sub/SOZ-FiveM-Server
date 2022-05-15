local giveAnimation = function(src)
    TriggerClientEvent("animation:client:give", src)
end

QBCore.Functions.CreateCallback("inventory:server:openPlayerInventory", function(source, cb, type, id)
    local ply = Player(source)
    local Player = QBCore.Functions.GetPlayer(source)

    if not ply.state.inv_busy then
        cb(Inventory(Player.PlayerData.source))
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Inventaire en cours d'utilisation", "warning")
        cb(nil)
    end
end)

RegisterNetEvent("inventory:server:UseItemSlot", function(slot)
    local Player = QBCore.Functions.GetPlayer(source)
    local itemData = Player.Functions.GetItemBySlot(slot)

    if itemData == nil then
        return
    end

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
        if itemData and itemData.amount > 0 then
            if QBCore.Functions.CanUseItem(itemData.name) then
                QBCore.Functions.UseItem(Player.PlayerData.source, itemData)
            end
        end
    end
end)

RegisterServerEvent("inventory:server:GiveItem", function(target, item, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    local Target = QBCore.Functions.GetPlayer(tonumber(target))
    local dist = #(GetEntityCoords(GetPlayerPed(Player.PlayerData.source)) - GetEntityCoords(GetPlayerPed(Target.PlayerData.source)))

    if Player.PlayerData.source == Target.PlayerData.source then
        return
    end
    if dist > 2 then
        return TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Personne n'est à portée de vous", "error")
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
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ne pouvez pas donner cet objet !", "error")
                TriggerClientEvent("hud:client:DrawNotification", Target.PlayerData.source, "Vous ne pouvez pas recevoir d'objet !", "error")
            end
        end)
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ne possédez pas le nombre d'items requis pour le transfert", "error")
    end
end)

RegisterServerEvent("inventory:server:GiveMoney", function(target, moneyType, amount)
    if moneyType ~= "money" and moneyType ~= "marked_money" then
        return
    end

    local Player = QBCore.Functions.GetPlayer(source)
    local Target = QBCore.Functions.GetPlayer(tonumber(target))
    local dist = #(GetEntityCoords(GetPlayerPed(Player.PlayerData.source)) - GetEntityCoords(GetPlayerPed(Target.PlayerData.source)))

    if Player.PlayerData.source == Target.PlayerData.source then
        return
    end
    if dist > 2 then
        return TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Personne n'est à portée de vous", "error")
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
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ne possédez pas l'argent requis pour le transfert", "error")
    end
end)

RegisterServerEvent("inventory:server:ResellItem", function(item, amount, resellZone)
    if resellZone == nil then
        return
    end

    local Player = QBCore.Functions.GetPlayer(source)

    if amount <= 0 then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez rien à vendre", "error")
        return
    elseif amount > item.amount then
        amount = item.amount
    end

    if item.metadata.expiration ~= nil and exports["soz-utils"]:ItemIsExpired(item) then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ne pouvez pas revendre des produits périmés", "error")
        return
    end

    local itemSpec = QBCore.Shared.Items[item.name]
    if itemSpec == nil or not itemSpec.resellPrice or not itemSpec.resellZone or itemSpec.resellZone ~= resellZone.ZoneName then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Cet item ne peut pas être revendu", "error")
        return
    end

    local success = Inventory.RemoveItem(Player.PlayerData.source, item.name, amount, item.metadata, item.slot)
    if not success then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez rien vendu", "error")
        return
    end

    TriggerEvent("banking:server:TransferMoney", resellZone.SourceAccount, resellZone.TargetAccount, itemSpec.resellPrice * amount)
    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, string.format("Vous avez vendu ~o~%s ~b~%s", amount, itemSpec.label))
end)
