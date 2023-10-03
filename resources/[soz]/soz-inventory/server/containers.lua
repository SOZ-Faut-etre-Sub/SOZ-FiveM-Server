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
    allowedTypes = {"weapon", "tool"},
    inventoryPermissionCallback = playerHaveJobAndDuty,
})

Container["fridge"] = InventoryContainer:new({
    type = "fridge",
    allowedTypes = {"food", "drink", "cocktail", "liquor", "crate", "drug"},
    inventoryPermissionCallback = playerHaveJobAndDuty,
})

Container["trunk"] = InventoryContainer:new({
    type = "trunk",
    allowedTypes = {
        "weapon",
        "weapon_attachment",
        "weapon_ammo",
        "item",
        "fishing_rod",
        "fishing_garbage",
        "fishing_bait",
        "fish",
        "drug",
        "drink",
        "cocktail",
        "food",
        "oil_and_item",
        "plank",
        "sawdust",
        "item_illegal",
        "liquor",
        "furniture",
        "flavor",
        "outfit",
        "crate",
        "drug_pot",
        "tool",
    },
})

Container["temporary_trunk"] = InventoryDatastore:new({
    type = "temporary_trunk",
    allowedTypes = {
        "weapon",
        "weapon_attachment",
        "weapon_ammo",
        "fishing_rod",
        "fishing_garbage",
        "fishing_bait",
        "fish",
        "item",
        "drug",
        "drink",
        "cocktail",
        "food",
        "oil_and_item",
        "plank",
        "sawdust",
        "item_illegal",
        "liquor",
        "furniture",
        "flavor",
        "outfit",
        "crate",
        "drug_pot",
        "tool",
    },
})

Container["tanker"] = InventoryContainer:new({type = "trunk", allowedTypes = {"oil", "oil_and_item"}})
Container["brickade"] = InventoryContainer:new({type = "trunk", allowedTypes = {"energy"}})
Container["trailerlogs"] = InventoryContainer:new({type = "trunk", allowedTypes = {"log"}})
Container["tiptruck"] = InventoryContainer:new({type = "trunk", allowedTypes = {"metal"}})
Container["trash"] = InventoryContainer:new({
    type = "trunk",
    allowedTypes = {
        "item",
        "fishing_rod",
        "fishing_garbage",
        "fishing_bait",
        "fish",
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
        "crate",
        "drug_pot",
    },
})

Container["storage"] = InventoryContainer:new({
    type = "storage",
    allowedTypes = {"item", "oil_and_item", "outfit", "crate", "drug_pot"},
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
    allowedTypes = {"weapon", "weapon_attachment", "weapon_ammo", "drug", "item", "item_illegal", "drug_pot", "tool"},
    inventoryPermissionCallback = playerHaveJobAndDuty,
})
--- Todo: convert to storage type : storage
Container["boss_storage"] = InventoryContainer:new({
    type = "boss_storage",
    allowedTypes = {"weapon", "weapon_ammo", "item", "oil_and_item", "tool"},
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
        "fishing_rod",
        "fishing_garbage",
        "fishing_bait",
        "fish",
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
        "crate",
        "drug_pot",
        "tool",
    },
    populateDatastoreCallback = function()
        local inventory = {}
        local items = getBinItems()

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
        "log",
        "oil_and_item",
        "plank",
        "sawdust",
        "fishing_rod",
        "fishing_garbage",
        "fishing_bait",
        "fish",
        "drug_pot",
        "tool",
    },
})
Container["house_fridge"] = InventoryContainer:new({
    type = "fridge",
    allowedTypes = {"food", "drink", "cocktail", "liquor", "flavor", "crate", "drug"},
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

Container["snack_storage"] = InventoryContainer:new({
    type = "snack_storage",
    allowedTypes = {"food"},
    inventoryPermissionCallback = playerHaveJobAndDuty,
})

Container["smuggling_box"] = InventoryDatastore:new({
    type = "storage",
    allowedTypes = {
        "item",
        "fishing_rod",
        "fishing_garbage",
        "fishing_bait",
        "fish",
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
        "crate",
        "drug_pot",
        "tool",
    },
})

--- Jobs DMC

local canAccessConverter = function(player, owner)
    if player.PlayerData.job.id ~= owner or not player.PlayerData.job.onduty then
        return false
    end
    if not exports['soz-core']:CanAccessConverter() then
        TriggerClientEvent("soz-core:client:notification:draw", player.PlayerData.source, "Impossible d'accéder au Convertisseur lorsque sa température s'ajuste.", "error")
        return false
    end
    return true
end

Container["metal_converter"] = InventoryContainer:new({
    type = "metal_converter",
    allowedTypes = {"metal"},
    inventoryPermissionCallback = canAccessConverter,
    syncCallback = function (id, items)
        local inv = GetOrCreateInventory("metal_converter", id)
        if not inv then
            return false
        end
        if table.length(inv.users) > 0 then
            for player, _ in pairs(inv.users) do
                TriggerClientEvent("inventory:client:updateTargetStoragesState", player, inv)
            end
        end

    end,
})

Container["metal_incinerator"] = InventoryContainer:new({
    type = "metal_incinerator",
    allowedTypes = {
        'metal',
        'weapon',
        'weapon_ammo',
    },
    inventoryPermissionCallback = playerHaveJobAndDuty,
    inventoryGetContentCallback = function()
        return false
    end,
})

Container["metal_storage"] = InventoryContainer:new({
    type = "metal_storage",
    allowedTypes = {
        "item", "oil_and_item", "outfit", "crate", "drug_pot", "metal",
    },
    inventoryPermissionCallback = playerHaveJobAndDuty,
})


--- LS Custom
Container["ls_custom_storage"] = InventoryContainer:new({
    type = "ls_custom_storage",
    allowedTypes = {'item'},
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
        "crate",
        "fish",
        "fishing_rod",
        "fishing_garbage",
        "fishing_bait",
        "drug_pot",
    },
    inventoryPermissionCallback = playerHaveJobAndDuty,
    inventoryGetContentCallback = function()
        return false
    end,
})
