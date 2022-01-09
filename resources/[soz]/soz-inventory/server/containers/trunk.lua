--- @class TrunkInventory
TrunkInventory = {}

function TrunkInventory.new()
    return setmetatable({}, {
        __index = TrunkInventory,
        __tostring = function() return 'TrunkInventory' end
    })
end

--- load
--- @param id any
--- @param citizenid any
--- @return table
function TrunkInventory:load(id, owner)
    local result = exports.oxmysql:scalar_async('SELECT inventory FROM storages WHERE name = ?', { id })
    if result == nil then
        exports.oxmysql:execute('INSERT INTO storages(name,type,owner) VALUES (?,?,?) ON DUPLICATE KEY UPDATE name=name', { id, 'trunk', owner })
    end
    return result and json.decode(result) or {}
end

--- save
--- @param id any
--- @param owner any
--- @param inventory table
--- @return boolean
function TrunkInventory:save(id, owner, inventory)
    inventory = json.encode(self:CompactInventory(inventory))
    exports.oxmysql:update_async('UPDATE storages SET inventory = ? WHERE name = ?', { inventory, id })
    return true
end

--- AllowedItems
--- @param item table
--- @return boolean
function TrunkInventory:AllowedItems(item)
    return true
end

--- AccessAllowed
--- @param owner string
--- @param player Player
--- @return boolean
function TrunkInventory:AccessAllowed(owner, playerId)
    -- TODO: implement key management
    return true
end

--- sync
--- @param id any
--- @param items table
--- @return boolean
function TrunkInventory:sync(id, items)
    -- Do nothing
end

--- Exports functions
setmetatable(TrunkInventory, { __index = InventoryShell })
_G.Container['trunk'] = TrunkInventory.new()
