--- @class StorageInventory
StorageInventory = {}

function StorageInventory.new()
    return setmetatable({}, {
        __index = StorageInventory,
        __tostring = function()
            return "StorageInventory"
        end,
    })
end

--- load
--- @param id any
--- @param citizenid any
--- @return table
function StorageInventory:load(id, owner)
    local result = exports.oxmysql:scalar_async("SELECT inventory FROM storages WHERE name = ?", {id})
    if result == nil then
        exports.oxmysql:execute("INSERT INTO storages(name,type,owner) VALUES (?,?,?) ON DUPLICATE KEY UPDATE name=name", {
            id,
            "storage",
            owner,
        })
    end
    return result and json.decode(result) or {}
end

--- save
--- @param id any
--- @param owner any
--- @param inventory table
--- @return boolean
function StorageInventory:save(id, owner, inventory)
    inventory = json.encode(self:CompactInventory(inventory))
    exports.oxmysql:update("UPDATE storages SET inventory = ? WHERE name = ?", {inventory, id})
    return true
end

--- AllowedItems
--- @param item table
--- @return boolean
function StorageInventory:AllowedItems(item)
    return true
end

--- AccessAllowed
--- @param owner string
--- @param player Player
--- @return boolean
function StorageInventory:AccessAllowed(owner, playerId)
    local Player = QBCore.Functions.GetPlayer(tonumber(playerId))

    if Player then
        return Player.PlayerData.job.id == owner
    else
        return false
    end
end

--- sync
--- @param id any
--- @param items table
--- @return boolean
function StorageInventory:sync(id, items)
    -- Do nothing
end

--- Exports functions
setmetatable(StorageInventory, {__index = InventoryShell})
_G.Container["storage"] = StorageInventory.new()
