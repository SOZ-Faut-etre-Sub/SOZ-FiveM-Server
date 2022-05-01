--- @class SeizureInventory
SeizureInventory = {}

function SeizureInventory.new()
    return setmetatable({}, {
        __index = SeizureInventory,
        __tostring = function()
            return "SeizureInventory"
        end,
    })
end

--- load
--- @param id any
--- @param citizenid any
--- @return table
function SeizureInventory:load(id, owner)
    local result = exports.oxmysql:scalar_async("SELECT inventory FROM storages WHERE name = ?", {id})
    if result == nil then
        exports.oxmysql:execute("INSERT INTO storages(name,type,owner,max_slots,max_weight) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE name=name",
                                {
            id,
            "seizure",
            owner,
            Config.StorageCapacity["seizure"].slot,
            Config.StorageCapacity["seizure"].weight,
        })
    end
    return result and json.decode(result) or {}
end

--- save
--- @param id any
--- @param owner any
--- @param inventory table
--- @return boolean
function SeizureInventory:save(id, owner, inventory)
    inventory = json.encode(self:CompactInventory(inventory))
    exports.oxmysql:update("UPDATE storages SET inventory = ? WHERE name = ?", {inventory, id})
    return true
end

--- AllowedItems
--- @param item table
--- @return boolean
function SeizureInventory:AllowedItems(item)
    local typeAllowed = {
        ["weapon"] = true,
        ["weapon_attachment"] = true,
        ["weapon_ammo"] = true,
        ["drug"] = true,
        ["item"] = true,
    }
    return typeAllowed[item.type or ""] or false
end

--- AccessAllowed
--- @param owner string
--- @param player Player
--- @return boolean
function SeizureInventory:AccessAllowed(owner, playerId)
    local Player = QBCore.Functions.GetPlayer(tonumber(playerId))

    if Player then
        return Player.PlayerData.job.id == owner and Player.PlayerData.job.onduty
    else
        return false
    end
end

--- sync
--- @param id any
--- @param items table
--- @return boolean
function SeizureInventory:sync(id, items)
    -- Do nothing
end

--- Exports functions
setmetatable(SeizureInventory, {__index = InventoryShell})
_G.Container["seizure"] = SeizureInventory.new()
