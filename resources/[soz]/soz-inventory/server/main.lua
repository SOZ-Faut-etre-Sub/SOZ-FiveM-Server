QBCore = exports['qb-core']:GetCoreObject()

local Inventory   = {}
local Inventories = {}

setmetatable(Inventory, {
    __call = function(self, arg)
        if arg then
            if type(arg) == 'table' then return arg end
            if type(arg) == 'number' then arg = tostring(arg) end
            return Inventories[arg]
        end
        return self
    end
})


--- Management
function Inventory.Create(id, label, invType, slots, maxWeight, owner, items)
    if _G.Container[invType] == nil then
        print('Inventory type not valid !')
        return
    end

    if maxWeight then
        local self = {
            id        = tostring(id),
            label     = label or id,
            type      = invType,
            slots     = slots,
            weight    = 0,
            maxWeight = maxWeight,
            owner     = owner,
            items     = type(items) == 'table' and items,
            changed   = false,
            open      = false,
            time      = os.time()
        }

        if not self.items then
            self.items, self.weight, self.datastore = Inventory.Load(self.id, self.type, self.owner)
        elseif self.weight == 0 and next(self.items) then
            self.weight = Inventory.CalculateWeight(self.items)
        end

        Inventories[self.id] = self
        _G.Container[self.type]:sync(self.id, self.items)

        return Inventories[self.id]
    end
end

function Inventory.Load(id, invType, owner)
    local datastore, result = nil, nil

    if (id or owner) and invType then
        result = _G.Container[invType]:load(id, owner)
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

function Inventory.Clear(inv, keep)
    inv = Inventory(inv)
    if inv then
        if not keep then
            table.wipe(inv.items)
            inv.weight = 0
            _G.Container[inv.type]:sync(inv.id, inv.items)
        end
    end
end

function Inventory.Remove(inv)
    inv                 = Inventory(inv)
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

function Inventory.CanSwapItem(inv, firstItem, firstItemAmount, testItem, testItemAmount)
    inv                 = Inventory(inv)
    local firstItemData = Inventory.GetItem(inv, firstItem)
    local testItemData  = Inventory.GetItem(inv, testItem)
    if firstItemData.amount >= firstItemAmount then
        local weightWithoutFirst = inv.weight - (firstItemData.weight * firstItemAmount)
        local weightWithTest     = weightWithoutFirst + (testItemData.weight * testItemAmount)
        return weightWithTest <= inv.maxWeight
    end
    return false
end

function Inventory.CanCarryItem(inv, item, amount, metadata)
    if type(item) ~= 'table' then item = QBCore.Shared.Items[item] end
    if item then
        inv                                      = Inventory(inv)
        local itemSlots, totalAmount, emptySlots = Inventory.GetItemSlots(inv, item, metadata == nil and {} or type(metadata) == 'string' and { type = metadata } or metadata)

        if #itemSlots > 0 or emptySlots > 0 then
            if inv.type == 'player' and item.limit and (totalAmount + amount) > item.limit then return false end
            if item.weight == 0 then return true end
            if amount == nil then amount = 1 end
            local newWeight = inv.weight + (item.weight * amount)
            return newWeight <= inv.maxWeight
        end
    end
end


--- Items management
function Inventory.Search(inv, search, item, metadata)
    if item then
        inv = Inventory(inv)
        if inv then
            inv = inv.items
            if search == 'slots' then search = 1 elseif search == 'amount' then search = 2 end
            if type(item) == 'string' then item = { item } end
            if type(metadata) == 'string' then metadata = { type = metadata } end

            local items      = #item
            local returnData = {}
            for i = 1, items do
                local item = QBCore.Shared.Items[item[i]].name
                if search == 1 then
                    returnData[item] = {}
                elseif search == 2 then
                    returnData[item] = 0
                end
                for _, v in pairs(inv) do
                    if v.name == item then
                        if not v.metadata then
                            v.metadata = {} end
                        if not metadata or table.contains(v.metadata, metadata) then
                            if search == 1 then
                                returnData[item][#returnData[item] + 1] = inv[v.slot]
                            elseif search == 2 then
                                returnData[item] = returnData[item] + v.amount
                            end
                        end
                    end
                end
            end
            if next(returnData) then return items == 1 and returnData[item[1]] or returnData end
        end
    end
    return false
end

function Inventory.AddItem(inv, item, amount, metadata, slot, cb)
    if type(inv) ~= 'table' then inv = Inventory(inv) end
    if type(item) ~= 'table' then item = QBCore.Shared.Items[item] end
    amount                = math.floor(amount + 0.5)
    local success, reason = false, nil
    if item then
        if inv then
            metadata, amount = metadata or {}, amount
            local existing   = false

            if slot then
                local slotItem = inv.items[slot]
                if not slotItem or not item.unique and slotItem and slotItem.name == item.name and table.matches(slotItem.metadata, metadata) then
                    existing = nil
                end
            end

            if existing == false then
                local items, toSlot = inv.items, nil
                for i = 1, inv.slots do
                    local slotItem = items[i]
                    if not item.unique and slotItem ~= nil and slotItem.name == item.name and table.matches(slotItem.metadata, metadata) then
                        toSlot, existing = i, true
                        break
                    elseif not toSlot and slotItem == nil then
                        toSlot = i
                    end
                end
                slot = toSlot
            end

            Inventory.SetSlot(inv, item, amount, metadata, slot)
            inv.weight = inv.weight + item.weight * amount
            success    = true

            inv.changed = true
            _G.Container[inv.type]:sync(inv.id, inv.items)
        else
            success = false
            reason  = 'invalid_inventory'
        end
    else
        success = false
        reason  = 'invalid_item'
    end
    if cb then cb(success, reason) end
end
RegisterNetEvent('inventory:server:AddItem', Inventory.AddItem)
exports('AddItem', Inventory.AddItem)

function Inventory.SetMetadata(inv, slot, metadata)
    inv  = Inventory(inv)
    slot = type(slot) == 'number' and (inv and inv.items[slot])

    if inv and slot then
        if inv then
            for k,v in pairs(metadata) do
                slot.metadata[k] = v
            end
            _G.Container[inv.type]:sync(inv.id, inv.items)
        end
    end
end
RegisterNetEvent('inventory:server:SetMetadata', Inventory.SetMetadata)
exports('SetMetadata', Inventory.SetMetadata)

function Inventory.RemoveItem(inv, item, amount, metadata, slot)
    if type(item) ~= 'table' then item = QBCore.Shared.Items[item] end
    amount = math.floor(amount + 0.5)
    if item and amount > 0 then
        inv = Inventory(inv)

        if metadata ~= nil then
            metadata = type(metadata) == 'string' and { type = metadata } or metadata
        end

        local itemSlots, totalAmount = Inventory.GetItemSlots(inv, item, metadata)
        if amount > totalAmount then amount = totalAmount end
        local removed, total, slots = 0, amount, {}
        if slot and itemSlots[slot] then
            removed = amount
            Inventory.SetSlot(inv, item, -amount, metadata, slot)
            slots[#slots + 1] = inv.items[slot] or slot
        elseif itemSlots and totalAmount > 0 then
            for k, v in pairs(itemSlots) do
                if removed < total then
                    if v == amount then
                        removed           = total
                        inv.items[k]      = nil
                        slots[#slots + 1] = inv.items[k] or k
                    elseif v > amount then
                        Inventory.SetSlot(inv, item, -amount, metadata, k)
                        slots[#slots + 1] = inv.items[k] or k
                        removed           = total
                        amount            = v - amount
                    else
                        removed           = removed + v
                        amount            = amount - v
                        inv.items[k]      = nil
                        slots[#slots + 1] = k
                    end
                    inv.changed = true
                else break end
            end
        end

        inv.weight = inv.weight - item.weight * removed
        if removed > 0 and inv.type == 'player' then
            local array = table.create(#slots, 0)

            for k, v in pairs(slots) do
                if type(v) == 'number' then
                    array[k] = { item = { slot = v, label = item.label, name = item.name }, inventory = inv.type }
                else
                    array[k] = { item = v, inventory = inv.type }
                end
            end

            inv.changed = true
            _G.Container[inv.type]:sync(inv.id, inv.items)
        end
    end
end
RegisterNetEvent('inventory:server:RemoveItem', Inventory.RemoveItem)
exports('RemoveItem', Inventory.RemoveItem)

function Inventory.TransfertItem(invSource, invTarget, item, amount, metadata, slot, cb)
    if type(invSource) ~= 'table' then invSource = Inventory(invSource) end
    if type(invTarget) ~= 'table' then invTarget = Inventory(invTarget) end
    if type(item) ~= 'table' then item = QBCore.Shared.Items[item] end
    if not metadata then metadata = {} end
    amount = math.floor(amount + 0.5)
    local success, reason = false, nil

    if item then
        if invSource then
            if invTarget then
                local itemSlots, totalAmount
                if slot then
                    local it = Inventory.GetItem(invSource, item, metadata)
                    if it then
                        itemSlots, totalAmount, metadata = it.slot, it.amount, it.metadata
                    end
                else
                    itemSlots, totalAmount = Inventory.GetItemSlots(invSource, item, metadata)
                end

                if itemSlots ~= nil or totalAmount ~= nil then
                    if amount > totalAmount then amount = totalAmount end

                    if Inventory.CanCarryItem(invTarget, item, amount, metadata) then
                        Inventory.RemoveItem(invSource, item, amount, metadata, slot)
                        Inventory.AddItem(invTarget, item, amount, metadata, false, function(s, r)
                            success, reason = s, r
                        end)

                        _G.Container[invSource.type]:sync(invSource.id, invSource.items)
                        _G.Container[invTarget.type]:sync(invTarget.id, invTarget.items)
                    else
                        success, reason = false, 'inventory_full'
                    end
                else
                    success, reason = false, 'nonexistent_item'
                end
            else
                success, reason = false, 'invalid_inventory'
            end
        else
            success, reason = false, 'invalid_inventory'
        end
    else
        success, reason = false, 'invalid_item'
    end

    if cb then cb(success, reason) end
end


--- Slots
function Inventory.GetItem(inv, item, metadata, returnsAmount)
    item = type(item) == 'table' and item or QBCore.Shared.Items[item]
    if type(item) ~= 'table' then item = QBCore.Shared.Items[item] end
    if item then
        item         = returnsAmount and item or table.clone(item)
        inv          = Inventory(inv)
        local amount = 0
        if inv then
            metadata = not metadata and false or type(metadata) == 'string' and { type = metadata } or metadata
            for _, v in pairs(inv.items) do
                if v and v.name == item.name and (not metadata or table.contains(v.metadata, metadata)) then
                    amount = amount + v.amount
                end
            end
        end
        if returnsAmount then return amount else
            item.amount = amount
            return item
        end
    end
end

function Inventory.GetItemSlots(inv, item, metadata)
    inv                                  = Inventory(inv)
    local totalAmount, slots, emptySlots = 0, {}, inv.slots
    for k, v in pairs(inv.items) do
        emptySlots = emptySlots - 1
        if v.name == item.name then
            if metadata and v.metadata == nil then
                v.metadata = {}
            end
            if not metadata or table.matches(v.metadata, metadata) then
                totalAmount = totalAmount + v.amount
                slots[k]    = v.amount
            end
        end
    end
    return slots, totalAmount, emptySlots
end

function Inventory.SetSlot(inv, item, amount, metadata, slot)
    inv               = Inventory(inv)
    local currentSlot = inv.items[slot]
    local newAmount   = currentSlot and currentSlot.amount + amount or amount
    if currentSlot and newAmount < 1 then
        amount          = currentSlot.amount
        inv.items[slot] = nil
    else
        inv.items[slot]        = {
            name        = item.name,
            label       = item.label,
            amount      = newAmount,
            metadata    = metadata,
            description = item.description,
            weight      = item.weight,
            type        = item.type,
            unique      = item.unique,
            useable     = item.useable,
            image       = item.image,
            shouldClose = item.shouldClose,
            slot        = slot,
            combinable  = item.combinable,
        }
        inv.items[slot].weight = Inventory.SlotWeight(item, inv.items[slot])
    end
    inv.changed = true
end

---
--- Create/Drop storage
---

--- Create Player Storage
RegisterNetEvent('inventory:CreatePlayerInventory', function(player --[[PlayerData]])
    Inventory.Create(
            player.source,
            player.charinfo.firstname .. ' ' .. player.charinfo.lastname,
            'player',
            Config.MaxInvSlots,
            Config.MaxWeight,
            player.citizenid
    )
end)

--- Drop Player Storage
RegisterNetEvent('inventory:DropPlayerInventory', function(playerID --[[PlayerData]])
    local inv               = Inventory(playerID)

    _G.Container[inv.type]:save(inv.id, inv.owner, inv.items)
    Inventory.Remove(playerID)
end)

--- Loops
local function saveInventories(loop)
    for _, inv in pairs(Inventories) do
        if not inv.datastore and inv.changed then
            if _G.Container[inv.type]:save(inv.id, inv.owner, inv.items) then
                inv.changed = false
            end
        end
    end

    if loop then
        SetTimeout(60000, saveInventories)
    end
end

saveInventories(true)


-- Events
AddEventHandler('txAdmin:events:scheduledRestart', function(event)
    if event.secondsRemaining == 60 then
        SetTimeout(50000, function()
            saveInventories()
        end)
    end
end)

AddEventHandler('onResourceStop', function(resource)
    if resource == GetCurrentResourceName() then
        saveInventories()
    end
end)

_G.Inventory = Inventory
_G.Container = {}
