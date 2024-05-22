InventoryDatastore = {}

function InventoryDatastore:new(options)
    self.__index = self
    local inventoryOptions = {
        type = nil,
        allowedTypes = {},
        allowedItems = {},
        populateDatastoreCallback = nil,
        inventoryGetContentCallback = nil,
        inventoryPutContentCallback = nil,
    }

    if not options.type then
        error("InventoryDatastore:new() - type is required")
    end

    if not options.allowedTypes and not options.allowedItems then
        error("InventoryDatastore:new() - allowedTypes or allowedItems is required")
    end

    for key, value in pairs(options) do
        if key == "allowedTypes" then
            local itemsType = {}
            for _, v in pairs(value) do
                itemsType[v] = true
            end
            value = itemsType
        end

        if key == "allowedItems" then
            local itemsName = {}
            for _, v in pairs(value) do
                itemsName[v] = true
            end
            value = itemsName
        end

        inventoryOptions[key] = value
    end

    return setmetatable(inventoryOptions, self)
end

function InventoryDatastore:LoadInventory(id, owner, slots, max_weight)
    local inventory = {}

    if self.populateDatastoreCallback then
        inventory = self.populateDatastoreCallback()
    end

    return inventory
end

function InventoryDatastore:SaveInventory(id, owner, inventory)
    --- Keep the inventory in the memory, it's only used by the InventoryContainer class
end

function InventoryDatastore:SyncInventory(inv)
    --- Keep this function empty, it's only used by the InventoryContainer class
end

function InventoryDatastore:ItemIsAllowed(item, inv)
    if self.type == "player" then
        return true
    end

    return self.allowedTypes[item.type or ""] or self.allowedItems[item.name or ""] or false
end

function InventoryDatastore:CanPlayerUseInventory(owner, playerId)
    return true
end

function InventoryDatastore:CanGetContentInInventory(inv)
    if not self.inventoryGetContentCallback then
        return true
    end

    return self.inventoryGetContentCallback(inv)
end
function InventoryDatastore:CanPutContentInInventory(inv)
    if not self.inventoryPutContentCallback then
        return true
    end

    return self.inventoryPutContentCallback(inv)
end

function InventoryDatastore:IsDatastore()
    return true
end
