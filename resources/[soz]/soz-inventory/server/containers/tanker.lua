--- @class TankerInventory
TankerInventory = {}

function TankerInventory.new()
    return setmetatable({}, {
        __index = TankerInventory,
        __tostring = function()
            return "TankerInventory"
        end,
    })
end

--- load
--- @param id any
--- @param citizenid any
--- @return table
function TankerInventory:load(id, owner)
    local result = exports.oxmysql:scalar_async("SELECT inventory FROM storages WHERE name = ?", {id})
    if result == nil then
        exports.oxmysql:execute("INSERT INTO storages(name,type,owner) VALUES (?,?,?) ON DUPLICATE KEY UPDATE name=name", {
            id,
            "trunk", -- Tanker is trunk variation
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
function TankerInventory:save(id, owner, inventory)
    inventory = json.encode(self:CompactInventory(inventory))
    exports.oxmysql:update("UPDATE storages SET inventory = ? WHERE name = ?", {inventory, id})
    return true
end

--- AllowedItems
--- @param item table
--- @return boolean
function TankerInventory:AllowedItems(item)
    local typeAllowed = {["oil"] = true, ["oil_and_item"] = true}
    return typeAllowed[item.type or ""] or false
end

--- AccessAllowed
--- @param owner string
--- @param player Player
--- @return boolean
function TankerInventory:AccessAllowed(owner, playerId)
    -- TODO: implement key management
    return true
end

--- sync
--- @param id any
--- @param items table
--- @return boolean
function TankerInventory:sync(id, items)
    -- Do nothing
end

--- Exports functions
setmetatable(TankerInventory, {__index = InventoryShell})
_G.Container["tanker"] = TankerInventory.new()
