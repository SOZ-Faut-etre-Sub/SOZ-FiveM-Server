--- Setup global callbacks for the containers.
local playerHaveStashAccess = function(player, owner)
    return string.find(owner, player.PlayerData.citizenid) ~= nil
end

local playerHaveJob = function(player, owner)
    return player.PlayerData.job.id == owner
end

local playerHaveJobAndDuty = function(player, owner)
    return player.PlayerData.job.id == owner and player.PlayerData.job.onduty
end

--- Setup all containers
Container["player"] = InventoryContainer:new({
    type = "player",
    allowedTypes = {},
    syncCallback = function(id, items)
        local Player = QBCore.Functions.GetPlayer(tonumber(id))

        if Player then
            Player.Functions.SetInventory(items)
        else
            return false
        end
    end,
})

Container["ammo"] = InventoryContainer:new({
    type = "ammo",
    allowedTypes = {"weapon_ammo"},
    inventoryPermissionCallback = playerHaveJobAndDuty,
})

Container["armory"] = InventoryContainer:new({
    type = "armory",
    allowedTypes = {"weapon"},
    inventoryPermissionCallback = playerHaveJobAndDuty,
})

Container["fridge"] = InventoryContainer:new({
    type = "fridge",
    allowedTypes = {"food", "drink", "cocktail", "liquor"},
    inventoryPermissionCallback = playerHaveJobAndDuty,
})

Container["trunk"] = InventoryContainer:new({
    type = "trunk",
    allowedTypes = {
        "weapon",
        "weapon_attachment",
        "weapon_ammo",
        "item",
        "drug",
        "drink",
        "food",
        "oil_and_item",
        "plank",
        "sawdust",
        "item_illegal",
        "liquor",
        "furniture",
        "flavor",
        "outfit",
    },
})

Container["temporary_trunk"] = InventoryDatastore:new({
    type = "temporary_trunk",
    allowedTypes = {
        "weapon",
        "weapon_attachment",
        "weapon_ammo",
        "item",
        "drug",
        "drink",
        "food",
        "oil_and_item",
        "plank",
        "sawdust",
        "item_illegal",
        "liquor",
        "furniture",
        "flavor",
        "outfit",
    },
})

Container["tanker"] = InventoryContainer:new({type = "trunk", allowedTypes = {"oil", "oil_and_item"}})
Container["brickade"] = InventoryContainer:new({type = "trunk", allowedTypes = {"energy"}})
Container["trailerlogs"] = InventoryContainer:new({type = "trunk", allowedTypes = {"log"}})
Container["trash"] = InventoryContainer:new({
    type = "trunk",
    allowedTypes = {
        "item",
        "drug",
        "food",
        "drink",
        "cocktail",
        "item_illegal",
        "organ",
        "oil",
        "oil_and_item",
        "log",
        "sawdust",
        "plank",
        "flavor",
        "furniture",
        "liquor",
        "outfit",
    },
})

Container["storage"] = InventoryContainer:new({
    type = "storage",
    allowedTypes = {"item", "drug", "oil_and_item", "outfit"},
    inventoryPermissionCallback = playerHaveJobAndDuty,
})
--- Todo: convert to storage type : storage
Container["storage_tank"] = InventoryContainer:new({
    type = "storage_tank",
    allowedTypes = {"oil", "oil_and_item"},
    inventoryPermissionCallback = playerHaveJobAndDuty,
})
--- Todo: convert to storage type : storage
Container["seizure"] = InventoryContainer:new({
    type = "seizure",
    allowedTypes = {"weapon", "weapon_attachment", "weapon_ammo", "drug", "item", "item_illegal"},
    inventoryPermissionCallback = playerHaveJobAndDuty,
})
--- Todo: convert to storage type : storage
Container["boss_storage"] = InventoryContainer:new({
    type = "boss_storage",
    allowedTypes = {"weapon", "weapon_ammo", "item", "drug", "oil_and_item"},
    inventoryPermissionCallback = function(player, owner)
        return SozJobCore.Functions.HasPermission(owner, player.PlayerData.job.id, player.PlayerData.job.grade, SozJobCore.JobPermission.SocietyPrivateStorage)
    end,
})

Container["cloakroom"] = InventoryContainer:new({
    type = "cloakroom",
    allowedTypes = {"outfit"},
    inventoryPermissionCallback = playerHaveJobAndDuty,
})

--- Todo: convert to storage type : storage
Container["organ"] = InventoryContainer:new({
    type = "organ",
    allowedTypes = {"organ"},
    inventoryPermissionCallback = playerHaveJobAndDuty,
})

Container["stash"] = InventoryContainer:new({
    type = "stash",
    allowedTypes = {"item"},
    inventoryPermissionCallback = playerHaveStashAccess,
})

Container["bin"] = InventoryDatastore:new({
    type = "bin",
    allowedTypes = {
        "item",
        "drug",
        "food",
        "drink",
        "cocktail",
        "item_illegal",
        "organ",
        "oil",
        "oil_and_item",
        "log",
        "sawdust",
        "plank",
        "flavor",
        "furniture",
        "liquor",
        "outfit",
    },
    populateDatastoreCallback = function()
        local inventory = {}
        local items = {
            ["plastic"] = math.random(0, 100) >= 90 and math.random(0, 2) or 0,
            ["metalscrap"] = math.random(0, 100) >= 90 and math.random(0, 1) or 0,
            ["aluminum"] = math.random(0, 100) >= 90 and math.random(0, 2) or 0,
            ["rubber"] = math.random(0, 100) >= 90 and math.random(0, 2) or 0,
            ["electronickit"] = math.random(0, 100) >= 90 and 1 or 0,
            ["rolex"] = math.random(0, 100) >= 95 and 1 or 0,
            ["diamond_ring"] = math.random(0, 100) >= 95 and 1 or 0,
            ["goldchain"] = math.random(0, 100) >= 95 and 1 or 0,
            ["10kgoldchain"] = math.random(0, 100) >= 95 and 1 or 0,
            ["goldbar"] = math.random(0, 100) >= 98 and 1 or 0,
            ["garbagebag"] = math.random(5, 20),
        }

        local availableWeight = Config.StorageCapacity["bin"].weight
        for item, amount in pairs(items) do
            if amount > 0 then
                local itemsWeight = QBCore.Shared.Items[item].weight * amount

                if availableWeight >= itemsWeight then
                    inventory[#inventory + 1] = {slot = #inventory + 1, name = item, type = "item", amount = amount}
                    availableWeight = availableWeight - QBCore.Shared.Items[item].weight * amount
                else
                    local maxAmount = math.floor(availableWeight / QBCore.Shared.Items[item].weight)
                    if maxAmount > 0 then
                        inventory[#inventory + 1] = {
                            slot = #inventory + 1,
                            name = item,
                            type = "item",
                            amount = maxAmount,
                        }
                        availableWeight = availableWeight - QBCore.Shared.Items[item].weight * maxAmount
                    end
                end
            end
        end

        return inventory
    end,
})

--- Housing
Container["house_stash"] = InventoryContainer:new({
    type = "stash",
    allowedTypes = {
        "item",
        "item_illegal",
        "weapon",
        "weapon_ammo",
        "furniture",
        "outfit",
        "drug",
        "log",
        "oil_and_item",
        "plank",
        "sawdust",
    },
})
Container["house_fridge"] = InventoryContainer:new({
    type = "fridge",
    allowedTypes = {"food", "drink", "cocktail", "liquor", "flavor"},
})

--- Jobs PAWL
Container["log_storage"] = InventoryContainer:new({
    type = "log_storage",
    allowedTypes = {"log"},
    inventoryPermissionCallback = playerHaveJob,
})
Container["plank_storage"] = InventoryContainer:new({
    type = "plank_storage",
    allowedTypes = {"plank"},
    inventoryPermissionCallback = playerHaveJob,
})
Container["sawdust_storage"] = InventoryContainer:new({
    type = "sawdust_storage",
    allowedTypes = {"sawdust"},
    inventoryPermissionCallback = playerHaveJob,
})
Container["log_processing"] = InventoryContainer:new({
    type = "log_processing",
    allowedTypes = {"log"},
    inventoryPermissionCallback = playerHaveJob,
    inventoryGetContentCallback = function()
        return false
    end,
})
--- PAWL - ZKEA
Container["cabinet_storage"] = InventoryContainer:new({
    type = "cabinet_storage",
    allowedTypes = {"item"},
    inventoryPermissionCallback = playerHaveJobAndDuty,
})

--- Jobs UPW
Container["inverter"] = InventoryContainer:new({
    type = "inverter",
    allowedTypes = {"energy"},
    inventoryPermissionCallback = playerHaveJob,
})

--- Jobs BAUN
Container["liquor_storage"] = InventoryContainer:new({
    type = "liquor_storage",
    allowedTypes = {"liquor"},
    inventoryPermissionCallback = playerHaveJobAndDuty,
})

Container["flavor_storage"] = InventoryContainer:new({
    type = "flavor_storage",
    allowedTypes = {"flavor"},
    inventoryPermissionCallback = playerHaveJobAndDuty,
})

Container["furniture_storage"] = InventoryContainer:new({
    type = "furniture_storage",
    allowedTypes = {"furniture"},
    inventoryPermissionCallback = playerHaveJobAndDuty,
})

--- Jobs BB
Container["recycler_processing"] = InventoryContainer:new({
    type = "recycler_processing",
    allowedTypes = {
        "item",
        "drug",
        "food",
        "drink",
        "cocktail",
        "item_illegal",
        "organ",
        "oil",
        "oil_and_item",
        "log",
        "sawdust",
        "plank",
        "flavor",
        "furniture",
        "liquor",
    },
    inventoryPermissionCallback = playerHaveJobAndDuty,
    inventoryGetContentCallback = function()
        return false
    end,
})
