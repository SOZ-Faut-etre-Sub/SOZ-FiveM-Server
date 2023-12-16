local giveAnimation = function(src)
    TriggerClientEvent("soz-core:client:animation:give", src)
end

QBCore.Functions.CreateCallback("inventory:server:openPlayerInventory", function(source, cb, type, id)
    if not id then
        id = source
    end

    local playerState = exports["soz-core"]:GetPlayerState(source)
    local Player = QBCore.Functions.GetPlayer(id)

    if Player and not playerState.isInventoryBusy then
        cb(Inventory(id))
    else
        TriggerClientEvent("soz-core:client:notification:draw", source, "Inventaire en cours d'utilisation", "warning")
        cb(nil)
    end
end)

RegisterNetEvent("inventory:server:UseItemSlot", function(slot)
    local playerState = exports["soz-core"]:GetPlayerState(source)
    local Player = QBCore.Functions.GetPlayer(source)
    local itemData = Player.Functions.GetItemBySlot(slot)

    if itemData == nil then
        return
    end

    if Player.PlayerData.metadata["isdead"] or Player.PlayerData.metadata["ishandcuffed"] or Player.PlayerData.metadata["inlaststand"] then
        return
    end

    if playerState.isInventoryBusy then
        TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Une action est déjà en cours !", "warning")
        return
    end

    itemData.slot = slot

    if itemData.type == "weapon" then
        TriggerClientEvent("soz-core:client:weapon:use-weapon", Player.PlayerData.source, itemData)
    elseif itemData and itemData.amount > 0 and QBCore.Functions.CanUseItem(itemData.name) then
        QBCore.Functions.UseItem(Player.PlayerData.source, itemData)
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
        return TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Personne n'est à portée de vous", "error")
    end

    if amount <= item.amount then
        if amount == 0 then
            amount = item.amount
        end

        Inventory.TransfertItem(source, Player.PlayerData.source, Target.PlayerData.source, item.name, amount, item.metadata, item.slot,
                                function(success, reason)
            if success then
                TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source,
                                   string.format("Vous avez donné ~o~%s ~b~%s", amount, item.label))
                TriggerClientEvent("soz-core:client:notification:draw", Target.PlayerData.source,
                                   string.format("Vous avez reçu ~o~%s ~b~%s", amount, item.label))

                giveAnimation(Player.PlayerData.source)
                giveAnimation(Target.PlayerData.source)
            else
                TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source,
                                   "Vous ne pouvez pas donner cet objet !" .. Config.ErrorMessage[reason] or reason, "error")
                TriggerClientEvent("soz-core:client:notification:draw", Target.PlayerData.source,
                                   "Vous ne pouvez pas recevoir d'objet !" .. Config.ErrorMessage[reason] or reason, "error")
            end
        end)
    else
        TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Vous ne possédez pas le nombre d'items requis pour le transfert",
                           "error")
    end
end)

RegisterServerEvent("inventory:server:forceconsume", function(target, slot)
    local Player = QBCore.Functions.GetPlayer(target)
    local itemData = Player.Functions.GetItemBySlot(slot)

    if itemData == nil then
        return
    end

    itemData.slot = slot
    QBCore.Functions.UseItem(target, itemData)
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
        return TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Personne n'est à portée de vous", "error")
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

        TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, string.format("Vous avez donné ~r~%s$", amount))
        TriggerClientEvent("soz-core:client:notification:draw", Target.PlayerData.source, string.format("Vous avez reçu ~g~%s$", amount))

        giveAnimation(Player.PlayerData.source)
        giveAnimation(Target.PlayerData.source)

        exports["soz-core"]:Event("give_money", {player_source = source, target = Target.PlayerData.citizenid},
                                  {money = moneyTake, marked_money = markedMoneyTake})
    else
        TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Vous ne possédez pas l'argent requis pour le transfert", "error")
    end
end)

RegisterServerEvent("inventory:server:ResellItem", function(item, amount, resellZone)
    if resellZone == nil then
        return
    end

    local Player = QBCore.Functions.GetPlayer(source)

    if amount <= 0 then
        TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Vous n'avez rien à vendre", "error")
        return
    elseif amount > item.amount then
        amount = item.amount
    end

    if item.metadata.expiration ~= nil and exports["soz-core"]:ItemIsExpired(item) then
        TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Vous ne pouvez pas revendre des produits périmés", "error")
        return
    end

    if resellZone.ZoneName == "Resell:hub" then
        TriggerEvent("soz-core:server:hub:shop-resell", source, item, amount)
        return
    end

    if resellZone.ZoneName == "Resell:fish" then
        TriggerEvent("soz-core:server:fishing:resell", source, item, amount)
        return
    end

    local itemSpec = QBCore.Shared.Items[item.name]
    if itemSpec == nil or not itemSpec.resellPrice or not itemSpec.resellZone then
        TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Cet objet ne peut pas être revendu", "error")
        return
    end

    if itemSpec == nil or not itemSpec.resellPrice or not itemSpec.resellZone or itemSpec.resellZone ~= resellZone.ZoneName then
        TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Cet objet ne peut pas être revendu ici", "error")
        return
    end

    local success = Inventory.RemoveItem(Player.PlayerData.source, item.name, amount, item.metadata, item.slot)
    if not success then
        TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Vous n'avez rien vendu", "error")
        return
    end

    if resellZone.ZoneName == "Resell:Zkea" and item.name == "cabinet_zkea" then
        local tier = tonumber(item.metadata.tier) or 1
        local zkeaAmount = itemSpec.resellZkeaQty[tier] * amount
        local msg = string.format("%s meuble(s) ajouté(s) au stock Zkea.", zkeaAmount)

        local s, r = Inventory.AddItem(Player.PlayerData.source, "cabinet_storage", item.name, zkeaAmount, {}, nil, nil)
        if not s and r == "invalid_weight" then
            local availableAmount = math.floor(Inventory.CalculateAvailableWeight("cabinet_storage") / itemSpec.weight)
            if availableAmount > 0 then
                Inventory.AddItem(Player.PlayerData.source, "cabinet_storage", item.name, availableAmount, {}, nil, nil)
                msg = string.format("%s meuble(s) ajouté(s) au stock Zkea. Le stock est maintenant plein.", availableAmount)
            else
                msg = string.format("Aucun meuble ajouté au stock Zkea. Le stock est déjà plein.", availableAmount)
            end
        end

        TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, msg, "info")
    end

    local price = itemSpec.resellPrice
    if type(itemSpec.resellPrice) == "table" then
        price = itemSpec.resellPrice[item.metadata.tier] or 1
    end

    TriggerEvent("banking:server:TransferMoney", resellZone.SourceAccount, resellZone.TargetAccount, math.ceil(price) * amount)
    TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, string.format("Vous avez vendu ~o~%s ~b~%s", amount, itemSpec.label))

    TriggerEvent("soz-core:server:monitor:add-event", "job_resell", {
        item_id = item.name,
        player_source = Player.PlayerData.source,
    }, {itemSpec = itemSpec.label, quantity = amount}, false)
end)
