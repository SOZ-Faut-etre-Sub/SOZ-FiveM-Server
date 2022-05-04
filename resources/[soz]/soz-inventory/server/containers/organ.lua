--- @class OrganInventory
OrganInventory = {}

function OrganInventory.new()
    return setmetatable({}, {
        __index = OrganInventory,
        __tostring = function()
            return "OrganInventory"
        end,
    })
end

--- load
--- @param id any
--- @param citizenid any
--- @return table
function OrganInventory:load(id, owner)
    local result = exports.oxmysql:scalar_async("SELECT inventory FROM storages WHERE name = ?", {id})
    if result == nil then
        exports.oxmysql:execute("INSERT INTO storages(name,type,owner,max_slots,max_weight) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE name=name",
                                {
            id,
            "organ",
            owner,
            Config.StorageCapacity["organ"].slot,
            Config.StorageCapacity["organ"].weight,
        })
    end
    return result and json.decode(result) or {}
end

--- save
--- @param id any
--- @param owner any
--- @param inventory table
--- @return boolean
function OrganInventory:save(id, owner, inventory)
    inventory = json.encode(self:CompactInventory(inventory))
    exports.oxmysql:update("UPDATE storages SET inventory = ? WHERE name = ?", {inventory, id})
    return true
end

--- AllowedItems
--- @param item table
--- @return boolean
function OrganInventory:AllowedItems(item)
    local typeAllowed = {["organ"] = true}
    return typeAllowed[item.type or ""] or false
end

--- AccessAllowed
--- @param owner string
--- @param player Player
--- @return boolean
function OrganInventory:AccessAllowed(owner, playerId)
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
function OrganInventory:sync(id, items)
    -- Do nothing
end

--- Exports functions
setmetatable(OrganInventory, {__index = InventoryShell})
_G.Container["organ"] = OrganInventory.new()
