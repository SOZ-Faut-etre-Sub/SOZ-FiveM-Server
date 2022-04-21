--- @class PlayerInventory
PlayerInventory = {}

function PlayerInventory.new()
    return setmetatable({}, {
        __index = PlayerInventory,
        __tostring = function()
            return "PlayerInventory"
        end,
    })
end

--- load
--- @param _ any
--- @param citizenid any
--- @return table
function PlayerInventory:load(_, citizenid)
    local result = exports.oxmysql:scalar_async("SELECT inventory FROM player WHERE citizenid = ?", {citizenid})
    return result and json.decode(result) or {}
end

--- save
--- @param id any
--- @param owner any
--- @param inventory table
--- @return boolean
function PlayerInventory:save(id, owner, inventory)
    inventory = json.encode(self:CompactInventory(inventory))
    exports.oxmysql:update("UPDATE player SET inventory = ? WHERE citizenid = ?", {inventory, owner})
    return true
end

--- sync
--- @param id any
--- @param items table
--- @return boolean
function PlayerInventory:sync(id, items)
    local Player = QBCore.Functions.GetPlayer(tonumber(id))

    if Player then
        Player.Functions.SetInventory(items)
    else
        return false
    end
end

--- Exports functions
setmetatable(PlayerInventory, {__index = InventoryShell})
_G.Container["player"] = PlayerInventory.new()
