RegisterServerEvent("inventory:server:openInventory", function(storageType, invID, ctx)
    local Player = QBCore.Functions.GetPlayer(source)

    local sourceInv = Inventory(source)
    local targetInv = GetOrCreateInventory(storageType, invID, ctx)

    if Inventory.AccessGranted(targetInv, Player.PlayerData.source) then
        targetInv.users[Player.PlayerData.source] = true

        TriggerClientEvent("inventory:client:openInventory", Player.PlayerData.source, Inventory.FilterItems(sourceInv, targetInv.type),
                           Inventory.FilterItems(targetInv, sourceInv.type))
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas accès à ce stockage", "error")
    end
end)

QBCore.Functions.CreateCallback("inventory:server:TransfertItem",
                                function(source, cb, inventorySource, inventoryTarget, item, amount, metadata, slot, targetSlot, manualFilter)
    Inventory.TransfertItem(inventorySource, inventoryTarget, item, amount, metadata, slot, function(success, reason)
        local sourceInv = Inventory(inventorySource)
        local targetInv = Inventory(inventoryTarget)

        local sourceInventory = Inventory.FilterItems(sourceInv, targetInv.type)
        if sourceInv.id == targetInv.id and manualFilter then
            sourceInventory = Inventory.FilterItems(sourceInv, manualFilter)
        end

        cb(success, reason, sourceInventory, Inventory.FilterItems(targetInv, sourceInv.type))
    end, targetSlot, manualFilter)
end)

RegisterServerEvent("inventory:server:closeInventory", function(invID)
    local targetInv = Inventory(invID)

    if targetInv and targetInv.users[source] then
        targetInv.users[source] = nil
    end
end)
