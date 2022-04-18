--- @class BossStorageInventory
BossStorageInventory = {}

function BossStorageInventory.new()
    return setmetatable({}, {
        __index = BossStorageInventory,
        __tostring = function()
            return "BossStorageInventory"
        end,
    })
end

--- load
--- @param id any
--- @param citizenid any
--- @return table
function BossStorageInventory:load(id, owner)
    local result = exports.oxmysql:scalar_async("SELECT inventory FROM storages WHERE name = ?", {id})
    if result == nil then
        exports.oxmysql:execute("INSERT INTO storages(name,type,owner) VALUES (?,?,?) ON DUPLICATE KEY UPDATE name=name", {
            id,
            "boss_storage",
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
function BossStorageInventory:save(id, owner, inventory)
    inventory = json.encode(self:CompactInventory(inventory))
    exports.oxmysql:update("UPDATE storages SET inventory = ? WHERE name = ?", {inventory, id})
    return true
end

--- AllowedItems
--- @param item table
--- @return boolean
function BossStorageInventory:AllowedItems(item)
    return true
end

--- AccessAllowed
--- @param owner string
--- @param player Player
--- @return boolean
function BossStorageInventory:AccessAllowed(owner, playerId)
    local SozJobCore = exports["soz-jobs"]:GetCoreObject()
    local Player = QBCore.Functions.GetPlayer(tonumber(playerId))

    if Player then
        return SozJobCore.Functions.HasPermission(owner, Player.PlayerData.job.id, Player.PlayerData.job.grade, SozJobCore.JobPermission.SocietyPrivateStorage)
    else
        return false
    end
end

--- sync
--- @param id any
--- @param items table
--- @return boolean
function BossStorageInventory:sync(id, items)
    -- Do nothing
end

--- Exports functions
setmetatable(BossStorageInventory, {__index = InventoryShell})
_G.Container["boss_storage"] = BossStorageInventory.new()
