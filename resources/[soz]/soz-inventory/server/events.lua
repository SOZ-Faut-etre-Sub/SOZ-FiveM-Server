RegisterServerEvent("inventory:server:openInventory", function(storageType, invID, ctx)
    local Player = QBCore.Functions.GetPlayer(source)

    local sourceInv = Inventory(source)
    local targetInv = Inventory(invID)

    local storageConfig = Config.StorageCapacity["default"]
    if Config.StorageCapacity[storageType] then
        storageConfig = Config.StorageCapacity[storageType]
    end

    if storageType == "bin" then
        targetInv = Inventory("bin_" .. invID)

        if targetInv == nil then
            targetInv = Inventory.Create("bin_" .. invID, invID, storageType, storageConfig.slot, storageConfig.weight, invID)
        end
    elseif storageType == "trunk" or storageType == "tanker" then
        targetInv = Inventory("trunk_" .. invID)

        if targetInv == nil then
            local trunkConfig = QBCore.Shared.Trunks["default"]
            if ctx and QBCore.Shared.Trunks[ctx] then
                trunkConfig = QBCore.Shared.Trunks[ctx]
            end

            targetInv = Inventory.Create("trunk_" .. invID, invID, storageType, trunkConfig.slot, trunkConfig.weight, invID)
        end
    elseif storageType == "stash" then
        targetInv = Inventory("stash_" .. invID)

        if targetInv == nil then
            targetInv = Inventory.Create("stash_" .. invID, invID, storageType, storageConfig.slot, storageConfig.weight, invID)
        end
    end

    if Inventory.AccessGranted(targetInv, Player.PlayerData.source) then
        targetInv.users[Player.PlayerData.source] = true

        TriggerClientEvent("inventory:client:openInventory", Player.PlayerData.source, Inventory.FilterItems(sourceInv, targetInv.type),
                           Inventory.FilterItems(targetInv, sourceInv.type))
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas accès à ce stockage", "error")
    end
end)

QBCore.Functions.CreateCallback("inventory:server:TransfertItem", function(source, cb, inventorySource, inventoryTarget, item, amount, slot)
    Inventory.TransfertItem(inventorySource, inventoryTarget, item, amount, false, slot, function(success, reason)
        local sourceInv = Inventory(inventorySource)
        local targetInv = Inventory(inventoryTarget)

        cb(success, reason, Inventory.FilterItems(sourceInv, targetInv.type), Inventory.FilterItems(targetInv, sourceInv.type))
    end)
end)

RegisterServerEvent("inventory:server:closeInventory", function(invID)
    local targetInv = Inventory(invID)

    if targetInv and targetInv.users[source] then
        targetInv.users[source] = nil
    end
end)
