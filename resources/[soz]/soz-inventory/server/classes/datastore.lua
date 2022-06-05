InventoryDatastore = {}

function InventoryDatastore:new(type, allowedTypes, populateDatastoreCallback)
    self.__index = self

    if not type then
        error("InventoryDatastore:new() - type is required")
    end

    if not allowedTypes then
        error("InventoryDatastore:new() - allowedTypes is required")
    end

    local itemsType = {}
    for _, v in pairs(allowedTypes) do
        itemsType[v] = true
    end

    return setmetatable({type = type, allowedTypes = itemsType, populateDatastoreCallback = populateDatastoreCallback}, self)
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

function InventoryDatastore:IsDatastore()
    return true
end
