InventoryDatastore = {}

function InventoryDatastore:new(options)
    self.__index = self
    local inventoryOptions = {
        type = nil,
        allowedTypes = {},
        populateDatastoreCallback = nil,
        inventoryGetContentCallback = nil,
        inventoryPutContentCallback = nil,
    }

    if not options.type then
        error("InventoryDatastore:new() - type is required")
    end

    if not options.allowedTypes then
        error("InventoryDatastore:new() - allowedTypes is required")
    end

    for key, value in pairs(options) do
        if key == "allowedTypes" then
            local itemsType = {}
            for _, v in pairs(value) do
                itemsType[v] = true
            end
            value = itemsType
        end

        inventoryOptions[key] = value
    end

    return setmetatable(inventoryOptions, self)
end

function InventoryDatastore:GetCapacity()
    local capacity = Config.StorageCapacity[self.type] or Config.StorageCapacity["default"]
    return capacity.slot, capacity.weight
end

function InventoryDatastore:LoadInventory(id, owner)
    local inventory = {}

    if self.populateDatastoreCallback then
        inventory = self.populateDatastoreCallback()
    end

    return inventory
end

function InventoryDatastore:SaveInventory(id, owner, inventory)
    --- Keep the inventory in the memory, it's only used by the InventoryContainer class
end

function InventoryDatastore:SyncInventory(id, items)
    --- Keep this function empty, it's only used by the InventoryContainer class
end

function InventoryDatastore:ItemIsAllowed(item)
    if self.type == "player" then
        return true
    end

    return self.allowedTypes[item.type or ""] or false
end

function InventoryDatastore:CanPlayerUseInventory(owner, playerId)
    return true
end

function InventoryDatastore:CanGetContentInInventory()
    if not self.inventoryGetContentCallback then
        return true
    end

    return self.inventoryGetContentCallback()
end
function InventoryDatastore:CanPutContentInInventory()
    if not self.inventoryPutContentCallback then
        return true
    end

    return self.inventoryPutContentCallback()
end

function InventoryDatastore:IsDatastore()
    return true
end
