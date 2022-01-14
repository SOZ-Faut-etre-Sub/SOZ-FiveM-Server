--- @class BinInventory
BinInventory = {}

function BinInventory.new()
    return setmetatable({}, {
        __index = BinInventory,
        __tostring = function()
            return "BinInventory"
        end,
    })
end

--- load
--- @param id any
--- @param citizenid any
--- @return table
function BinInventory:load(id, owner)
    return {}
end
--- IsDatastore
function BinInventory:IsDatastore()
    return true
end

--- AccessAllowed
--- @param owner string
--- @param player Player
--- @return boolean
function BinInventory:AccessAllowed(owner, playerId)
    return true
end

--- sync
--- @param id any
--- @param items table
--- @return boolean
function BinInventory:sync(id, items)
    -- Do nothing
end

--- Exports functions
setmetatable(BinInventory, {__index = InventoryShell})
_G.Container["bin"] = BinInventory.new()
