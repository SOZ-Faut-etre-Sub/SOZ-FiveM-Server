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
    inventoryPermissionCallback = playerHaveJob,
})

Container["armory"] = InventoryContainer:new({
    type = "armory",
    allowedTypes = {"weapon"},
    inventoryPermissionCallback = playerHaveJob,
})

Container["fridge"] = InventoryContainer:new({
    type = "fridge",
    allowedTypes = {"food", "drink"},
    inventoryPermissionCallback = playerHaveJob,
})

Container["trunk"] = InventoryContainer:new({
    type = "trunk",
    allowedTypes = {"weapon", "weapon_ammo", "item", "drug", "drink", "food", "oil_and_item", "plank", "sawdust"},
})
Container["tanker"] = InventoryContainer:new({type = "trunk", allowedTypes = {"oil", "oil_and_item"}})
Container["trailerlogs"] = InventoryContainer:new({type = "trunk", allowedTypes = {"log"}})

Container["storage"] = InventoryContainer:new({
    type = "storage",
    allowedTypes = {"item", "drug", "oil_and_item"},
    inventoryPermissionCallback = playerHaveJob,
})
--- Todo: convert to storage type : storage
Container["storage_tank"] = InventoryContainer:new({
    type = "storage_tank",
    allowedTypes = {"oil", "oil_and_item"},
    inventoryPermissionCallback = playerHaveJob,
})
--- Todo: convert to storage type : storage
Container["seizure"] = InventoryContainer:new({
    type = "seizure",
    allowedTypes = {"weapon", "weapon_attachment", "weapon_ammo", "drug", "item_illegal"},
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
--- Todo: convert to storage type : storage
Container["organ"] = InventoryContainer:new({
    type = "organ",
    allowedTypes = {"organ"},
    inventoryPermissionCallback = playerHaveJob,
})

Container["stash"] = InventoryContainer:new({
    type = "stash",
    allowedTypes = {"item"},
    inventoryPermissionCallback = playerHaveStashAccess,
})

Container["bin"] = InventoryDatastore:new({
    type = "bin",
    allowedTypes = {"item", "item_illegal"},
    populateDatastoreCallback = function()
        local inventory = {}
        local items = {
            ["plastic"] = math.random(0, 100) >= 80 and math.random(0, 2) or 0,
            ["metalscrap"] = math.random(0, 100) >= 80 and math.random(0, 1) or 0,
            ["aluminum"] = math.random(0, 100) >= 80 and math.random(0, 2) or 0,
            ["rubber"] = math.random(0, 100) >= 80 and math.random(0, 2) or 0,
            ["electronickit"] = math.random(0, 100) >= 80 and 1 or 0,
            ["rolex"] = math.random(0, 100) >= 90 and 1 or 0,
            ["diamond_ring"] = math.random(0, 100) >= 90 and 1 or 0,
            ["goldchain"] = math.random(0, 100) >= 90 and 1 or 0,
            ["10kgoldchain"] = math.random(0, 100) >= 90 and 1 or 0,
            ["goldbar"] = math.random(0, 100) >= 95 and 1 or 0,
            ["garbagebag"] = math.random(5, 20),
        }

        for item, amount in pairs(items) do
            if amount > 0 then
                inventory[#inventory + 1] = {slot = #inventory + 1, name = item, type = "item", amount = amount}
            end
        end

        return inventory
    end,
})

--- Housing
Container["house_stash"] = InventoryContainer:new({type = "stash", allowedTypes = {"item"}})
Container["house_fridge"] = InventoryContainer:new({type = "fridge", allowedTypes = {"food", "drink"}})

--- Jobs
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
