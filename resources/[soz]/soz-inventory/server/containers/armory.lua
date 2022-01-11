--- @class ArmoryInventory
ArmoryInventory = {}

function ArmoryInventory.new()
    return setmetatable({}, {
        __index = ArmoryInventory,
        __tostring = function()
            return "ArmoryInventory"
        end,
    })
end

--- load
--- @param id any
--- @param citizenid any
--- @return table
function ArmoryInventory:load(id, owner)
    local result = exports.oxmysql:scalar_async("SELECT inventory FROM storages WHERE name = ?", {id})
    if result == nil then
        exports.oxmysql:execute(
            "INSERT INTO storages(name,type,owner) VALUES (?,?,?) ON DUPLICATE KEY UPDATE name=name",
            {id, "armory", owner})
    end
    return result and json.decode(result) or {}
end

--- save
--- @param id any
--- @param owner any
--- @param inventory table
--- @return boolean
function ArmoryInventory:save(id, owner, inventory)
    inventory = json.encode(self:CompactInventory(inventory))
    exports.oxmysql:update_async("UPDATE storages SET inventory = ? WHERE name = ?", {inventory, id})
    return true
end

--- AllowedItems
--- @param item table
--- @return boolean
function ArmoryInventory:AllowedItems(item)
    local typeAllowed = {["weapon"] = true, ["weapon_attachment"] = true, ["weapon_ammo"] = true}
    return typeAllowed[item.type or ""] or false
end

--- AccessAllowed
--- @param owner string
--- @param player Player
--- @return boolean
function ArmoryInventory:AccessAllowed(owner, playerId)
    local Player = QBCore.Functions.GetPlayer(tonumber(playerId))

    if Player then
        return Player.PlayerData.job.name == owner
    else
        return false
    end
end

--- sync
--- @param id any
--- @param items table
--- @return boolean
function ArmoryInventory:sync(id, items)
    -- Do nothing
end

--- Exports functions
setmetatable(ArmoryInventory, {__index = InventoryShell})
_G.Container["armory"] = ArmoryInventory.new()
