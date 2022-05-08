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
