--- @class InventoryShell
InventoryShell = {}

function InventoryShell.new()
    return setmetatable({}, {
        __index = InventoryShell,
        __tostring = function()
            return "InventoryShell"
        end,
    })
end

function InventoryShell:CompactInventory(inv)
    local inventory = {}
    if inv ~= nil then
        for k, v in pairs(inv) do
            if v.name and v.amount > 0 then
                inventory[#inventory + 1] = {
                    name = v.name,
                    type = v.type,
                    slot = k,
                    amount = v.amount,
                    metadata = next(v.metadata) and v.metadata or nil,
                }
            end
        end
    end
    return inventory
end

--- load
--- @param id any
--- @param owner any
--- @return table
function InventoryShell:load(id, owner)
    print("^8" .. tostring(self) .. ":load() is not implemented !")
    return {}
end

--- save
--- @param id any
--- @param owner any
--- @param inventory string
--- @return boolean
function InventoryShell:save(id, owner, inventory)
    print("^8" .. tostring(self) .. ":save() is not implemented !")
    return false
end

--- IsDatastore
function InventoryShell:IsDatastore()
    return false
end

--- AllowedItems
--- @param item table
--- @return boolean
function InventoryShell:AllowedItems(item)
    return true
end

--- AccessAllowed
--- @param inventory table
--- @param player Player
--- @return boolean
function InventoryShell:AccessAllowed(inv, player)
    print("^8" .. tostring(self) .. ":AccessAllowed() is not implemented !")
    return true
end

--- sync
--- @param id any
--- @param items table
--- @return boolean
function InventoryShell:sync(id, items)
    print("^8" .. tostring(self) .. ":sync() is not implemented !")
    return false
end
