InventoryContainer = {}

function InventoryContainer:new(options)
    self.__index = self
    local inventoryOptions = {
        type = nil,
        allowedTypes = {},
        inventoryPermissionCallback = nil,
        syncCallback = nil,
        inventoryGetContentCallback = nil,
        inventoryPutContentCallback = nil,
    }

    if not options.type then
        error("InventoryContainer:new() - type is required")
    end

    if not options.allowedTypes then
        error("InventoryContainer:new() - allowedTypes is required")
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

function InventoryContainer:CompactInventory(inv)
    local inventory = {}
    if inv ~= nil then
        for k, v in pairs(inv) do
            if v.name and v.amount > 0 then
                inventory[#inventory + 1] = {
                    name = v.name,
                    type = v.type,
                    slot = k,
                    amount = v.amount,
                    metadata = next(v.metadata) and v.metadata or nil,
                }
            end
        end
    end
    return inventory
end

function InventoryContainer:GetCapacity()
    local capacity = Config.StorageCapacity[self.type] or Config.StorageCapacity["default"]
    return capacity.slot, capacity.weight
end

function InventoryContainer:LoadInventory(id, owner)
    local result = nil
    if self.type == "player" then --- Special case for player inventory
        result = exports.oxmysql:scalar_async("SELECT inventory FROM player WHERE citizenid = ?", {owner})
    else
        result = exports.oxmysql:scalar_async("SELECT inventory FROM storages WHERE name = ? AND type = ? AND owner = ?", {
            id,
            self.type,
            owner,
        })
        if result == nil then
            exports.oxmysql:insert_async("INSERT INTO storages(name,type,owner,max_slots,max_weight) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE name=name",
                                         {id, self.type, owner, self:GetCapacity()})
        end
    end
    return result and json.decode(result) or {}
end

function InventoryContainer:SaveInventory(id, owner, inventory)
    inventory = json.encode(self:CompactInventory(inventory))
    local affectedRows = 0

    if self.type == "player" then --- Special case for player inventory
        affectedRows = exports.oxmysql:update_async("UPDATE player SET inventory = ? WHERE citizenid = ?", {
            inventory,
            owner,
        })
    else
        affectedRows = exports.oxmysql:update_async("UPDATE storages SET inventory = ? WHERE name = ? AND type = ? AND owner = ?",
                                                    {inventory, id, self.type, owner})
    end

    return affectedRows >= 1
end

function InventoryContainer:SyncInventory(id, items)
    if self.syncCallback then
        self.syncCallback(id, items)
    end
end

function InventoryContainer:ItemIsAllowed(item)
    if self.type == "player" then
        return true
    end

    return self.allowedTypes[item.type or ""] or false
end

function InventoryContainer:CanPlayerUseInventory(owner, playerId)
    local Player = QBCore.Functions.GetPlayer(tonumber(playerId))

    if not self.inventoryPermissionCallback then
        return true
    end

    if Player then
        return self.inventoryPermissionCallback(Player, owner)
    else
        return false
    end
end

function InventoryContainer:CanGetContentInInventory()
    if not self.inventoryGetContentCallback then
        return true
    end

    return self.inventoryGetContentCallback()
end
function InventoryContainer:CanPutContentInInventory()
    if not self.inventoryPutContentCallback then
        return true
    end

    return self.inventoryPutContentCallback()
end

function InventoryContainer:IsDatastore()
    return false
end
