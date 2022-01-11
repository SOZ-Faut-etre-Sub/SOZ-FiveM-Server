RegisterServerEvent(
    "inventory:server:openInventory", function(invID)
        local Player = QBCore.Functions.GetPlayer(source)

        local sourceInv = Inventory(source)
        local targetInv = Inventory(invID)

        if targetInv.open == false and Inventory.AccessGranted(targetInv, source) then
            TriggerClientEvent("inventory:client:updateStorageState", -1, targetInv.id, Player.Functions.GetName())
            targetInv.open = true
            targetInv.user = source

            TriggerClientEvent(
                "inventory:client:openInventory", source, Inventory.FilterItems(sourceInv, targetInv.type),
                Inventory.FilterItems(targetInv, sourceInv.type)
            )
        else
            TriggerClientEvent("hud:client:DrawNotification", source, "~r~Vous n'avez pas accès à ce stockage")
        end
    end
)

RegisterServerEvent(
    "inventory:server:openTrunkInventory", function(plate)
        local Player = QBCore.Functions.GetPlayer(source)

        local sourceInv = Inventory(Player.PlayerData.source)
        local targetInv = Inventory("plate_" .. plate)

        if targetInv == nil then
            targetInv = Inventory.Create(
                            "plate_" .. plate, plate, "trunk", Config.StorageMaxInvSlots, Config.StorageMaxWeight, plate
                        )
        end

        if targetInv.open == false and Inventory.AccessGranted(targetInv, Player.PlayerData.source) then
            TriggerClientEvent("inventory:client:updateStorageState", -1, targetInv.id, Player.Functions.GetName())
            targetInv.open = true
            targetInv.user = Player.PlayerData.source

            TriggerClientEvent(
                "inventory:client:openInventory", Player.PlayerData.source,
                Inventory.FilterItems(sourceInv, targetInv.type), Inventory.FilterItems(targetInv, sourceInv.type)
            )
        else
            TriggerClientEvent(
                "hud:client:DrawNotification", Player.PlayerData.source, "~r~Vous n'avez pas accès à ce coffre"
            )
        end
    end
)

QBCore.Functions.CreateCallback(
    "inventory:server:TransfertItem", function(source, cb, inventorySource, inventoryTarget, item, amount, slot)
        Inventory.TransfertItem(
            inventorySource, inventoryTarget, item, amount, false, slot, function(success, reason)
                local sourceInv = Inventory(inventorySource)
                local targetInv = Inventory(inventoryTarget)

                cb(
                    success, reason, Inventory.FilterItems(sourceInv, targetInv.type),
                    Inventory.FilterItems(targetInv, sourceInv.type)
                )
            end
        )
    end
)

RegisterServerEvent(
    "inventory:server:closeInventory", function(invID)
        local targetInv = Inventory(invID)

        if targetInv.open == true and targetInv.user == source then
            targetInv.open = false
            targetInv.user = nil
            TriggerClientEvent("inventory:client:updateStorageState", -1, targetInv.id, nil)
        end
    end
)
