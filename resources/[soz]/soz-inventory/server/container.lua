local Inventory   = {}
local Inventories = {}

setmetatable(Inventory, {
    __call = function(self, arg)
        if arg then
            if arg and type(arg) == 'table' then
                return arg
            end
            return Inventories[arg]
        end
        return self
    end
})

--- Utilities function for Inventory
local function minimal(inv)
    inv                     = Inventory(inv)
    local inventory, amount = {}, 0
    for k, v in pairs(inv.items) do
        if v.name and v.amount > 0 then
            amount            = amount + 1
            inventory[amount] = {
                name     = v.name,
                type     = v.type,
                slot     = k,
                amount   = v.amount,
                metadata = next(v.metadata) and v.metadata or nil
            }
        end
    end
    return inventory
end


--- Management
function Inventory.Create(id, label, invType, slots, maxWeight, owner, items)
    if maxWeight then
        local self = {
            id        = id,
            label     = label or id,
            type      = invType,
            slots     = slots,
            weight    = 0,
            maxWeight = maxWeight,
            owner     = owner,
            items     = type(items) == 'table' and items,
            changed   = false,
            open      = false,
            minimal   = minimal,
            time      = os.time()
        }

        if not self.items then
            self.items, self.weight, self.datastore = Inventory.Load(self.id, self.type, self.owner)
        elseif self.weight == 0 and next(self.items) then
            self.weight = Inventory.CalculateWeight(self.items)
        end

        Inventories[self.id] = self
        return Inventories[self.id]
    end
end

function Inventory.Load(id, invType, owner)
    local isVehicle, datastore, result = invType == 'trunk', nil, nil

    if id and invType then
        if isVehicle then
            local plate = id:sub(6)
            if ox.playerslots then plate = string.strtrim(plate) end
            result = MySQL.single.await('SELECT ?? FROM owned_vehicles WHERE plate = ?', { invType, plate })
            if result then result = json.decode(result[invType])
            elseif ox.randomloot then return generateItems(id, 'vehicle')
            else datastore = true end
        elseif owner then
            result = exports.oxmysql:scalar_async('SELECT inventory FROM players WHERE citizenid = ?', { owner })
            if result then result = json.decode(result) end
        elseif invType == 'dumpster' then
            if ox.randomloot then return generateItems(id, invType) else datastore = true end
        else
            result = MySQL.prepare.await('SELECT data FROM ox_inventory WHERE owner = ? AND name = ?', { '', id })
            if result then result = json.decode(result) end
        end
    end

    local returnData, weight = {}, 0
    if result then
        for _, v in pairs(result) do
            local item = QBCore.Shared.Items[v.name]
            if item then
                local slotWeight   = Inventory.SlotWeight(item, v)
                weight             = weight + slotWeight
                returnData[v.slot] = {
                    name        = item.name,
                    amount      = v.amount,
                    metadata    = v.metadata or {},
                    label       = item.label,
                    description = item.description,
                    weight      = slotWeight,
                    type        = item.type,
                    unique      = item.unique,
                    useable     = item.useable,
                    image       = item.image,
                    shouldClose = item.shouldClose,
                    slot        = v.slot,
                    combinable  = item.combinable,
                }
            end
        end
    end
    return returnData, weight, datastore
end

function Inventory.Remove(inv)
    inv = Inventory(inv)
    Inventories[inv.id] = nil
end


--- Weight
function Inventory.CalculateWeight(items)
    local weight = 0
    for _, v in pairs(items) do
        local item = QBCore.Shared.Items[v.name]
        if item then
            weight = weight + Inventory.SlotWeight(item, v)
        end
    end
    return weight
end

function Inventory.SlotWeight(item, slot)
    local weight = item.weight * slot.amount
    if not slot.metadata then slot.metadata = {} end
    if item.ammoname then
        local ammo = {
            type   = item.ammoname,
            amount = slot.metadata.ammo,
            weight = QBCore.Shared.Items[item.ammoname].weight
        }

        if ammo.amount then
            weight = weight + (ammo.weight * ammo.amount)
        end
    end

    return weight
end


--- Create Storage
local function CreatePlayerInventory(player --[[PlayerData]])
    Inventory.Create(
        player.source,
        player.charinfo.firstname ..' '.. player.charinfo.lastname,
        'player',
        Config.MaxInvSlots,
        Config.MaxWeight,
        player.citizenid
    )
end
exports('CreatePlayerInventory', CreatePlayerInventory)

local function DropPlayerInventory(playerID --[[PlayerData]])
    Inventory.Save(playerID)
    Inventory.Remove(playerID)
end
exports('DropPlayerInventory', DropPlayerInventory)
