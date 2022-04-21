--- @class AmmoInventory
AmmoInventory = {}

function AmmoInventory.new()
    return setmetatable({}, {
        __index = AmmoInventory,
        __tostring = function()
            return "AmmoInventory"
        end,
    })
end

--- load
--- @param id any
--- @param citizenid any
--- @return table
function AmmoInventory:load(id, owner)
    local result = exports.oxmysql:scalar_async("SELECT inventory FROM storages WHERE name = ?", {id})
    if result == nil then
        exports.oxmysql:execute("INSERT INTO storages(name,type,owner) VALUES (?,?,?) ON DUPLICATE KEY UPDATE name=name", {
            id,
            "ammo",
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
function AmmoInventory:save(id, owner, inventory)
    inventory = json.encode(self:CompactInventory(inventory))
    exports.oxmysql:update("UPDATE storages SET inventory = ? WHERE name = ?", {inventory, id})
    return true
end

--- AllowedItems
--- @param item table
--- @return boolean
function AmmoInventory:AllowedItems(item)
    local typeAllowed = {["weapon_ammo"] = true}
    return typeAllowed[item.type or ""] or false
end

--- AccessAllowed
--- @param owner string
--- @param player Player
--- @return boolean
function AmmoInventory:AccessAllowed(owner, playerId)
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
function AmmoInventory:sync(id, items)
    -- Do nothing
end

--- Exports functions
setmetatable(AmmoInventory, {__index = InventoryShell})
_G.Container["ammo"] = AmmoInventory.new()
