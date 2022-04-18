--- @class StashInventory
StashInventory = {}

function StashInventory.new()
    return setmetatable({}, {
        __index = StashInventory,
        __tostring = function()
            return "StashInventory"
        end,
    })
end

--- load
--- @param id any
--- @param citizenid any
--- @return table
function StashInventory:load(id, owner)
    local result = exports.oxmysql:scalar_async("SELECT inventory FROM storages WHERE name = ?", {id})
    if result == nil then
        exports.oxmysql:execute("INSERT INTO storages(name,type,owner) VALUES (?,?,?) ON DUPLICATE KEY UPDATE name=name", {
            id,
            "stash",
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
function StashInventory:save(id, owner, inventory)
    inventory = json.encode(self:CompactInventory(inventory))
    exports.oxmysql:update("UPDATE storages SET inventory = ? WHERE name = ? AND owner = ?", {inventory, id, owner})
    return true
end

--- AllowedItems
--- @param item table
--- @return boolean
function StashInventory:AllowedItems(item)
    local typeAllowed = {["item"] = true}
    return typeAllowed[item.type or ""] or false
end

--- AccessAllowed
--- @param owner string
--- @param player Player
--- @return boolean
function StashInventory:AccessAllowed(owner, playerId)
    local Player = QBCore.Functions.GetPlayer(tonumber(playerId))

    if Player then
        if string.find(owner, Player.PlayerData.citizenid) ~= nil then
            return true
        else
            return false
        end
    else
        return false
    end
end

--- sync
--- @param id any
--- @param items table
--- @return boolean
function StashInventory:sync(id, items)
    -- Do nothing
end

--- Exports functions
setmetatable(StashInventory, {__index = InventoryShell})
_G.Container["stash"] = StashInventory.new()
