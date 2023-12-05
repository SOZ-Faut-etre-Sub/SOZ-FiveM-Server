QBCore = exports["qb-core"]:GetCoreObject()

local Inventory = {}
local Inventories = {}
local SyncInventory = true

setmetatable(Inventory, {
    __call = function(self, arg)
        if arg then
            if type(arg) == "table" then
                return arg
            end
            if type(arg) == "number" then
                arg = tostring(arg)
            end
            return Inventories[arg]
        end
        return self
    end,
})

MySQL.ready(function()
    local StorageNotLoaded = table.clone(Config.Storages)

    -- delete inventory of non players cars to avoid having an NPC car with same plate retrieving an existing inventory
    MySQL.query(
        "DELETE FROM storages WHERE NAME IN (SELECT name FROM storages LEFT OUTER JOIN player_vehicles on storages.owner = player_vehicles.plate where storages.`type`='trunk' AND player_vehicles.citizenid IS NULL)")

    MySQL.query("SELECT * FROM storages", {}, function(result)
        if result then
            for _, v in pairs(result) do
                if Config.Storages[v.name] then
                    local st = Config.Storages[v.name]
                    Inventory.Create(v.name, st.label, v.type, v.max_slots, v.max_weight, v.owner)
                    StorageNotLoaded[v.name] = nil
                end
            end
        end

        -- Create storage present in configuration if not exist in database
        for k, v in pairs(StorageNotLoaded) do
            local storageConfig = Config.StorageCapacity["default"]
            if Config.StorageCapacity[v.type] then
                storageConfig = Config.StorageCapacity[v.type]
            end

            Inventory.Create(k, v.label, v.type, storageConfig.slot, storageConfig.weight, v.owner)
        end
    end)
end)

--- Management
function Inventory.Create(id, label, invType, slots, maxWeight, owner, items)
    if _G.Container[invType] == nil then
        print(("Inventory type (%s) not valid !"):format(invType))
        return
    end

    if maxWeight then
        local self = {
            id = tostring(id),
            label = label or id,
            type = invType,
            -- Disable slots limitation for the moment
            slots = 10000, -- slots,
            weight = 0,
            maxWeight = maxWeight,
            owner = owner,
            items = type(items) == "table" and items,
            changed = false,
            users = {},
            time = os.time(),
        }

        if not self.items then
            self.items, self.weight, self.datastore = Inventory.Load(self.id, self.type, self.owner)
        elseif self.weight == 0 and next(self.items) then
            self.weight = Inventory.CalculateWeight(self.items)
        end

        Inventories[self.id] = self
        _G.Container[self.type]:SyncInventory(self.id, self.items)

        return Inventories[self.id]
    end
end

function Inventory.Load(id, invType, owner)
    local datastore, result = nil, nil

    if (id or owner) and invType then
        datastore = _G.Container[invType]:IsDatastore()
        result = _G.Container[invType]:LoadInventory(id, owner)
    end

    local returnData, weight = {}, 0
    if result then
        for _, v in pairs(result) do
            local item = QBCore.Shared.Items[v.name]
            if item then
                local slotWeight = Inventory.GetItemWeight(item, v.metadata, v.amount)
                weight = weight + slotWeight
                returnData[v.slot] = {
                    name = item.name,
                    amount = v.amount,
                    metadata = v.metadata or {},
                    label = item.label,
                    description = item.description,
                    weight = slotWeight,
                    type = item.type,
                    unique = item.unique,
                    useable = item.useable,
                    shouldClose = item.shouldClose,
                    slot = v.slot,
                    combinable = item.combinable,
                    illustrator = item.illustrator,
                }
            end
        end
    end
    return returnData, weight, datastore
end

function Inventory.AccessGranted(inv, playerId)
    inv = Inventory(inv)

    return _G.Container[inv.type]:CanPlayerUseInventory(inv.owner, playerId)
end

function Inventory.Clear(inv, keep)
    inv = Inventory(inv)
    if inv then
        if not keep then
            table.wipe(inv.items)
            inv.weight = 0
            _G.Container[inv.type]:SyncInventory(inv.id, inv.items)
        end
    end
end
RegisterNetEvent("inventory:server:Clear", Inventory.Clear)
exports("Clear", Inventory.Clear)

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
            weight = weight + Inventory.GetItemWeight(item, v.metadata, v.amount)
        end
    end
    return weight
end

function Inventory.CalculateAvailableWeight(inv)
    inv = Inventory(inv)
    local weight = Inventory.CalculateWeight(inv.items)
    local maxWeight = inv.maxWeight
    return maxWeight - weight
end

function Inventory.SetMaxWeight(inv, weight)
    inv = Inventory(inv)
    local overloaded = inv.maxWeight < inv.weight
    if inv then
        inv.maxWeight = weight
    end
    if inv.type == "player" and (inv.maxWeight < inv.weight or (overloaded and inv.maxWeight >= inv.weight)) then
        TriggerClientEvent("inventory:client:overloaded", inv.id, inv.maxWeight < inv.weight)
    end
end
exports("CalculateAvailableWeight", Inventory.CalculateAvailableWeight)
exports("CalculateWeight", Inventory.CalculateWeight)
exports("SetMaxWeight", Inventory.SetMaxWeight)

function Inventory.SetHouseStashMaxWeightFromTier(inv, tier)
    inv = Inventory("house_stash_" .. inv)
    if inv then
        inv.maxWeight = Config.StorageCapacity["house_stash"][tier].weight
    end
end
exports("SetHouseStashMaxWeightFromTier", Inventory.SetHouseStashMaxWeightFromTier)

function Inventory.GetItemWeight(item, metadata, amount)
    if metadata and metadata.weight then
        item.weight = metadata.weight
    end

    if not amount then
        amount = 1
    end

    local weight = item.weight * amount
    if not metadata then
        metadata = {}
    end

    if item.ammoname then
        local ammo = {type = item.ammoname, amount = metadata.ammo, weight = QBCore.Shared.Items[item.ammoname].weight}

        if ammo.amount then
            weight = weight + (ammo.weight * ammo.amount)
        end
    end

    if item.type == "crate" then
        weight = item.weight + Inventory.getCrateWeight(metadata)
    end

    return weight
end

function Inventory.CanSwapItem(inv, firstItem, firstItemAmount, testItem, testItemAmount)
    inv = Inventory(inv)
    local firstItemData = Inventory.GetItem(inv, firstItem)
    local testItemData = Inventory.GetItem(inv, testItem)
    if firstItemData.amount >= firstItemAmount then
        local weightWithoutFirst = inv.weight - (firstItemData.weight * firstItemAmount)
        local weightWithTest = weightWithoutFirst + (testItemData.weight * testItemAmount)
        return weightWithTest <= inv.maxWeight
    end
    return false
end
RegisterNetEvent("inventory:server:CanSwapItem", Inventory.CanSwapItem)
exports("CanSwapItem", Inventory.CanSwapItem)

function Inventory.CanSwapItems(inv, outItems, inItems)
    inv = Inventory(inv)

    local inWeight = 0;
    local outWeight = 0;

    for _, v in pairs(outItems) do
        local item = QBCore.Shared.Items[v.name]
        outWeight = outWeight + Inventory.GetItemWeight(item, v.metadata, v.amount)
    end

    for _, v in pairs(inItems) do
        local item = QBCore.Shared.Items[v.name]
        inWeight = inWeight + Inventory.GetItemWeight(item, v.metadata, v.amount)
    end

    return inv.weight + inWeight - outWeight <= inv.maxWeight
end
RegisterNetEvent("inventory:server:CanSwapItems", Inventory.CanSwapItems)
exports("CanSwapItems", Inventory.CanSwapItems)

function Inventory.CanCarryItem(inv, item, amount, metadata)
    if type(item) ~= "table" then
        item = QBCore.Shared.Items[item]
    end
    if item then
        inv = Inventory(inv)
        local itemSlots, totalAmount, emptySlots = Inventory.GetItemSlots(inv, item, metadata == nil and {} or type(metadata) == "string" and {
            type = metadata,
        } or metadata)

        if #itemSlots > 0 or emptySlots > 0 then
            if inv.type == "player" and item.limit and (totalAmount + amount) > item.limit then
                return false
            end
            if Inventory.GetItemWeight(item, metadata, 1) == 0 then
                return true
            end
            if amount == nil then
                amount = 1
            end
            local newWeight = inv.weight + Inventory.GetItemWeight(item, metadata, amount)
            return newWeight <= inv.maxWeight
        end
    end
end
RegisterNetEvent("inventory:server:CanCarryItem", Inventory.CanCarryItem)
exports("CanCarryItem", Inventory.CanCarryItem)

-- items is a table of objects that must provide "{ name = 'itemId', amount = 1 }"
-- You can use amount = -1 to use a similar effect to CanSwapItem with multiple items.
function Inventory.CanCarryItems(inv, items, metadata)
    inv = Inventory(inv)
    if items then
        local itemsTotalWeight = 0
        for _, v in pairs(items) do
            local item = QBCore.Shared.Items[v.name]
            local itemSlots, totalAmount, emptySlots = Inventory.GetItemSlots(inv, item, metadata == nil and {} or type(metadata) == "string" and
                                                                                  {type = metadata} or metadata)
            if #itemSlots > 0 or emptySlots > 0 then
                if inv.type == "player" and item.limit and (totalAmount + v.amount) > item.limit then
                    return false
                end
                itemsTotalWeight = itemsTotalWeight + Inventory.GetItemWeight(item, metadata, v.amount)
            end
        end

        local inventoryUsedWeight = Inventory.CalculateWeight(inv.items)
        return itemsTotalWeight + inventoryUsedWeight <= inv.maxWeight
    end
    return true
end
RegisterNetEvent("inventory:server:CanCarryItems", Inventory.CanCarryItems)
exports("CanCarryItems", Inventory.CanCarryItems)

--- Items management
function Inventory.FilterItems(inv, invType)
    if type(inv) ~= "table" then
        inv = Inventory(inv)
    end

    -- Clone inventory to filter frontend items and don't affect real inventory
    local inventory = table.deepclone(inv)
    local items = {}

    if invType then
        if inv.items ~= nil then
            for _, v in pairs(inv.items) do
                local insertId = #items + 1
                items[insertId] = table.deepclone(v)

                if not _G.Container[invType]:ItemIsAllowed(v) or
                    (invType == "player" and inv.type == "player" and QBCore.Shared.Items[v.name]["not_searchable"]) then
                    items[insertId].disabled = true
                end
            end
        end
    end

    inventory.items = items
    return inventory
end

function Inventory.Search(inv, search, item, metadata)
    if item then
        inv = Inventory(inv)
        if inv then
            inv = inv.items
            if search == "slots" then
                search = 1
            elseif search == "amount" then
                search = 2
            end
            if type(item) == "string" then
                item = {item}
            end
            if type(metadata) == "string" then
                metadata = {type = metadata}
            end

            local items = #item
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
                            v.metadata = {}
                        end
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
            if next(returnData) then
                return items == 1 and returnData[item[1]] or returnData
            end
        end
    end
    return false
end
exports("Search", Inventory.Search)

QBCore.Functions.CreateCallback("inventory:server:GetInventoryItems", function(source, cb)
    cb(Inventory(source).items)
end)

function Inventory.getCrateWeight(metadata)
    local crateTotalWeight = 0
    if not metadata or not metadata.crateElements then
        return crateTotalWeight
    end
    for _, crateItem in pairs(metadata.crateElements) do
        local item = QBCore.Shared.Items[crateItem.name]
        crateTotalWeight = crateTotalWeight + Inventory.GetItemWeight(item, metadata, crateItem.amount)
    end
    return crateTotalWeight
end

function Inventory.handleLunchbox(source, inv, slotItem, metadata, amount, item, slotId)
    local slot = -1
    local exist = false

    if slotItem.name == "empty_lunchbox" then
        Inventory.RemoveItem(inv, slotItem.name, 1, nil, slotId)
        local lunchboxItem = QBCore.Shared.Items["lunchbox"]
        _, _, slot = Inventory.AddItem(source, inv, lunchboxItem, 1, {crateElements = {}})
        slotItem = inv.items[slot]
    end

    local lunchboxTotalWeight = Inventory.getCrateWeight(slotItem.metadata)

    for _, element in pairs(slotItem.metadata.crateElements) do
        if element.name == item.name and metadata.expiration == element.metadata.expiration then
            element.amount = element.amount + amount
            exist = true
        end
    end

    if not exist then
        table.insert(slotItem.metadata.crateElements, {
            name = item.name,
            label = item.label,
            metadata = metadata,
            amount = amount,
            weight = Inventory.GetItemWeight(item, metadata, 1),
        })
    end

    local notificationLunchboxLabel = tostring(slotItem.label)
    if slotItem.metadata.label then
        notificationLunchboxLabel = notificationLunchboxLabel .. " \"" .. slotItem.metadata.label .. "\""
    end

    TriggerClientEvent("soz-core:client:notification:draw", source,
                       "Vous avez ajouté ~b~" .. item.label .. "~s~ dans ~g~" .. notificationLunchboxLabel .. "~s~ !", "success")
    return slotItem.metadata, true, slot
end

function Inventory.AddItem(source, inv, item, amount, metadata, slot, cb)
    if type(inv) ~= "table" then
        inv = Inventory(inv)
    end
    if type(item) ~= "table" then
        item = QBCore.Shared.Items[item]
    end
    amount = math.floor(amount + 0.5)
    local success, reason = false, nil
    local existing = false
    local weight = Inventory.GetItemWeight(item, metadata, amount)

    if amount <= 0 then
        reason = "invalid_quantity"
        goto endAddItem
    end

    if not item then
        reason = "invalid_item"
        goto endAddItem
    end

    if not inv then
        reason = "invalid_inventory"
        goto endAddItem
    end

    metadata, amount = metadata or {}, amount

    if item.type == "weapon" then
        if metadata.serial == nil then
            metadata.serial = tostring(QBCore.Shared.RandomInt(2) .. QBCore.Shared.RandomStr(3) .. QBCore.Shared.RandomInt(1) .. QBCore.Shared.RandomStr(2) ..
                                           QBCore.Shared.RandomInt(3) .. QBCore.Shared.RandomStr(4))
        end
        if metadata.tint == nil then
            metadata.tint = 0
        end
        if metadata.health == nil then
            metadata.health = 2000
        end
        if metadata.maxHealth == nil then
            metadata.maxHealth = 2000
        end
    elseif item.expiresIn and metadata.expiration == nil then
        metadata.expiration = os.date("%Y-%m-%dT%H:%M:00Z", os.time() + (item.expiresIn * 60))
    elseif item.durability and metadata.expiration == nil then
        metadata.expiration = os.date("%Y-%m-%d", os.time() + (item.durability * 60 * 60 * 24))
    end

    if not Inventory.CanCarryItem(inv, item, amount, metadata) then
        reason = "invalid_weight"
        goto endAddItem
    end

    if item.onlyone and inv.type == "player" and Inventory.Search(inv, "amount", item.name) > 0 then
        reason = "invalid_alreadyhaveone"
        goto endAddItem
    end
    if slot then
        local slotItem = inv.items[slot]
        if not slotItem or not item.unique and slotItem and slotItem.name == item.name and table.matches(slotItem.metadata, metadata) then
            existing = nil
        elseif (table.contains(Config.crateTypeAllowed, item.type)) and slotItem and slotItem.type == "crate" then
            if (Inventory.GetItemWeight(item, metadata, amount) + Inventory.getCrateWeight(slotItem.metadata)) < Config.crateMaxWeight then
                metadata, success, slot = Inventory.handleLunchbox(source, inv, slotItem, metadata, amount, item, slot)
                if success then
                    item = QBCore.Shared.Items["lunchbox"]
                    amount = 0
                    existing = nil
                else
                    goto endAddItem
                end
            else
                TriggerClientEvent("soz-core:client:notification:draw", source, "Ça ne rentre pas !", "warning")
            end
        elseif item.type == "fishing_bait" and slotItem and slotItem.type == "fishing_rod" then
            local metadata = {bait = item}
            if slotItem.metadata.bait ~= item then
                Inventory.SetMetadata(inv, slotItem.slot, metadata)
                amount = amount - 1
                weight = Inventory.GetItemWeight(item, metadata, amount)
                TriggerClientEvent("soz-core:client:notification:draw", source,
                                   "Vous avez attaché un ~b~" .. item.label .. "~s~ à vôtre ~g~" .. slotItem.label .. "~s~ !", "success")
                if amount == 0 then
                    success = true
                    goto endAddItem
                end
            else
                TriggerClientEvent("soz-core:client:notification:draw", source,
                                   "Impossible d'attacher ~b~" .. item.label .. "~s~ à vôtre ~g~" .. slotItem.label .. "~s~ !", "error")
            end
        elseif item.name == "kerosene_jerrycan" and slotItem and slotItem.name == "chainsaw" then
            local metadata = {fuel = 20}
            if slotItem.metadata.fuel ~= 20 then
                Inventory.SetMetadata(inv, slotItem.slot, metadata)
                amount = amount - 1
                weight = Inventory.GetItemWeight(item, metadata, amount)
                TriggerClientEvent("soz-core:client:notification:draw", source,
                                   "Vous avez rempli votre ~b~" .. slotItem.label .. "~s~ avec un  ~g~" .. item.label .. "~s~ !", "success")
                if amount == 0 then
                    success = true
                    goto endAddItem
                end
            else
                TriggerClientEvent("soz-core:client:notification:draw", source, "Le réservoir de ~b~" .. slotItem.label .. "~s~ est déjà plein !", "error")
            end
        elseif slotItem and slotItem.type == "drug_pot" then
            local slotItemDef = QBCore.Shared.Items[slotItem.name]
            if slotItemDef.drug_pot.ingredient == item.name and amount >= slotItemDef.drug_pot.nbIngredient and not exports["soz-core"]:ItemIsExpired(slotItem) and
                not exports["soz-core"]:ItemIsExpired({metadata = metadata}) then
                Inventory.RemoveItem(inv, slotItemDef.name, 1, nil, slotItem.slot)
                Inventory.AddItem(source, inv, slotItemDef.drug_pot.target, 1)
                amount = amount - slotItemDef.drug_pot.nbIngredient
                weight = Inventory.GetItemWeight(item, metadata, amount)

                if amount == 0 then
                    success = true
                    goto endAddItem
                end

            end
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

    inv.weight = inv.weight + weight
    Inventory.SetSlot(inv, item, amount, metadata, slot)
    success = true

    inv.changed = true
    _G.Container[inv.type]:SyncInventory(inv.id, inv.items)

    ::endAddItem::
    if cb then
        cb(success, reason)
    else
        return success, reason, slot
    end
end
RegisterNetEvent("inventory:server:AddItem", Inventory.AddItem)
exports("AddItem", Inventory.AddItem)

function Inventory.SetMetadata(inv, slot, metadata)
    inv = Inventory(inv)
    slot = type(slot) == "number" and (inv and inv.items[slot])
    if inv and slot then
        if inv then
            for k, v in pairs(metadata) do
                slot.metadata[k] = v
            end
            _G.Container[inv.type]:SyncInventory(inv.id, inv.items)
        end
    end
end
RegisterNetEvent("inventory:server:SetMetadata", Inventory.SetMetadata)
exports("SetMetadata", Inventory.SetMetadata)

function Inventory.RemoveItem(inv, item, amount, metadata, slot, allowMoreThanOwned)
    inv = Inventory(inv)
    if type(item) ~= "table" then
        item = QBCore.Shared.Items[item]
    end
    local overloaded = inv.type == "player" and inv.maxWeight < inv.weight
    amount = math.floor(amount + 0.5)
    if item and amount > 0 then
        if metadata ~= nil then
            metadata = type(metadata) == "string" and {type = metadata} or metadata
        end

        local itemSlots, totalAmount = Inventory.GetItemSlots(inv, item, metadata)
        if amount > totalAmount then
            if not allowMoreThanOwned then
                return false
            end
            amount = totalAmount
        end
        local removed, total, slots = 0, amount, {}
        if slot and itemSlots[slot] then
            if itemSlots[slot] < amount then
                return false
            end
            removed = amount
            Inventory.SetSlot(inv, item, -amount, metadata, slot)
            slots[#slots + 1] = inv.items[slot] or slot
        elseif itemSlots and totalAmount > 0 then
            for k, v in pairs(itemSlots) do
                if removed < total then
                    if v == amount then
                        removed = total
                        inv.items[k] = nil
                        slots[#slots + 1] = inv.items[k] or k
                    elseif v > amount then
                        Inventory.SetSlot(inv, item, -amount, metadata, k)
                        slots[#slots + 1] = inv.items[k] or k
                        removed = total
                        amount = v - amount
                    else
                        removed = removed + v
                        amount = amount - v
                        inv.items[k] = nil
                        slots[#slots + 1] = k
                    end
                    inv.changed = true
                else
                    break
                end
            end
        end

        inv.weight = inv.weight - Inventory.GetItemWeight(item, metadata, removed)
        if removed > 0 and inv.type == "player" then
            local array = table.create(#slots, 0)

            for k, v in pairs(slots) do
                if type(v) == "number" then
                    array[k] = {item = {slot = v, label = item.label, name = item.name}, inventory = inv.type}
                else
                    array[k] = {item = v, inventory = inv.type}
                end
            end

            inv.changed = true
            _G.Container[inv.type]:SyncInventory(inv.id, inv.items)
        end

        if overloaded and inv.maxWeight >= inv.weight then
            TriggerClientEvent("inventory:client:overloaded", inv.id, false)
        end

        return removed
    end
    return false
end
RegisterNetEvent("inventory:server:RemoveItem", Inventory.RemoveItem)
exports("RemoveItem", Inventory.RemoveItem)

function Inventory.TransfertItem(source, invSource, invTarget, item, amount, metadata, slot, cb, targetSlot)
    local success, reason = false, nil
    if type(invSource) ~= "table" then
        invSource = Inventory(invSource)
    end
    if type(invTarget) ~= "table" then
        invTarget = Inventory(invTarget)
    end
    if type(item) ~= "table" then
        item = QBCore.Shared.Items[item]
    end

    if item["giveable"] == false then
        if invSource.id ~= invTarget.id and not QBCore.Functions.HasPermission(src, "staff") then
            cb(false, "not_giveable")
            return
        end
    end

    if not metadata then
        metadata = {}
    end
    amount = math.floor(amount + 0.5)
    cb = type(cb) == "function" and cb or function()
    end

    if not item then
        cb(false, "invalid_item")
        return
    end

    if not amount or amount == 0 then
        cb(false, "invalid_amount")
        return
    end

    if not invSource or not invTarget then
        cb(false, "invalid_inventory")
        return
    end

    local itemSlots, totalAmount
    if slot then
        local it = Inventory.GetItem(invSource, item, metadata)
        if it then
            itemSlots, totalAmount = slot, it.amount
        end
    else
        itemSlots, totalAmount = Inventory.GetItemSlots(invSource, item, metadata)
    end

    if itemSlots == nil or totalAmount == nil then
        cb(false, "nonexistent_item")
        return
    end

    if not _G.Container[invSource.type]:CanGetContentInInventory(item) then
        cb(false, "get_not_allowed")
        return
    end

    if not _G.Container[invTarget.type]:CanPutContentInInventory(item) then
        cb(false, "put_not_allowed")
        return
    end

    if not _G.Container[invTarget.type]:ItemIsAllowed(item) then
        cb(false, "not_allowed_item")
        return
    end

    if amount > totalAmount then
        amount = totalAmount
    end

    if invSource.id == invTarget.id then
        if invSource.weight > invTarget.maxWeight then
            cb(false, "inventory_full")
            return
        end
    else
        if not Inventory.CanCarryItem(invTarget, item, amount, metadata) then
            cb(false, "inventory_full")
            return
        end
    end

    if Inventory.RemoveItem(invSource, item, amount, metadata, slot) then
        Inventory.AddItem(source, invTarget, item, amount, metadata, targetSlot, function(s, r)
            if not s then
                Inventory.AddItem(source, invSource, item, amount, metadata, slot)
            end
            success, reason = s, r
        end)

        exports["soz-core"]:Event("transfer_item", {
            source_owner = invSource.owner,
            source_id = invSource.type,
            target_owner = invTarget.owner,
            target_id = invTarget.type,
            player_source = source,
        }, {item = item.name, itemLabel = item.label, amount = amount})

        _G.Container[invSource.type]:SyncInventory(invSource.id, invSource.items)
        _G.Container[invTarget.type]:SyncInventory(invTarget.id, invTarget.items)
    end

    if invSource.type ~= "player" and table.length(invSource.users) > 1 then
        for player, _ in pairs(invSource.users) do
            TriggerClientEvent("inventory:client:updateTargetStoragesState", player, invSource)
        end
    end
    if invTarget.type ~= "player" and table.length(invTarget.users) > 1 then
        for player, _ in pairs(invTarget.users) do
            TriggerClientEvent("inventory:client:updateTargetStoragesState", player, invTarget)
        end
    end

    cb(success, reason)
end

function Inventory.SortInventoryAZ(inv, cb)
    local success, reason = false, nil
    if type(inv) ~= "table" then
        inv = Inventory(inv)
    end

    if not _G.Container[inv.type]:CanGetContentInInventory(item) then
        cb(false, "get_not_allowed")
        return
    end

    if not _G.Container[inv.type]:CanPutContentInInventory(item) then
        cb(false, "put_not_allowed")
        return
    end

    local inventorySorted = {}
    local sorted = table.deepclone(inv.items)
    for i = 1, 2 do
        inventorySorted = {}

        table.sort(sorted, function(a, b)
            if a == nil or b == nil then
                return false
            end

            if a.label == b.label then
                return a.amount < b.amount
            end

            if a.label == b.label and a.amount == b.amount then
                return table.matches(a.metadata, b.metadata)
            end

            return a.label < b.label
        end)

        for s, item in pairs(sorted) do
            local slot = #inventorySorted + 1

            inventorySorted[slot] = item
            inventorySorted[slot].slot = slot
        end

        sorted = table.deepclone(inventorySorted)
    end

    if table.length(inventorySorted) > 0 then
        inv.changed = true
        inv.items = inventorySorted

        _G.Container[inv.type]:SyncInventory(inv.id, inv.items)
        success = true

        if inv.type ~= "player" and table.length(inv.users) > 1 then
            for player, _ in pairs(inv.users) do
                TriggerClientEvent("inventory:client:updateTargetStoragesState", player, inv)
            end
        end
    else
        success = true
    end

    cb(success, reason)
end

--- Items By Type
function Inventory.GetItemsByType(inv, type)
    inv = Inventory(inv)
    local items = {}

    if inv then
        for _, v in pairs(inv.items) do
            local item = QBCore.Shared.Items[v.name]

            if item and item.type == type then
                table.insert(items, {item = item, amount = v.amount, metadata = v.metadata})
            end
        end
    end

    return items
end
RegisterNetEvent("inventory:server:GetItemsByType", Inventory.GetItemsByType)
exports("GetItemsByType", Inventory.GetItemsByType)

--- Get item
function Inventory.GetAllItems(inv)
    inv = Inventory(inv)
    local items = {}

    if inv then
        for _, v in pairs(inv.items) do
            local item = QBCore.Shared.Items[v.name]

            if item then
                table.insert(items, {item = item, amount = v.amount, metadata = v.metadata})
            end
        end
    end

    return items
end
RegisterNetEvent("inventory:server:GetAllItems", Inventory.GetAllItems)
exports("GetAllItems", Inventory.GetAllItems)

--- Slots
function Inventory.GetItem(inv, item, metadata, returnsAmount)
    item = type(item) == "table" and item or QBCore.Shared.Items[item]
    if type(item) ~= "table" then
        item = QBCore.Shared.Items[item]
    end
    if item then
        item = returnsAmount and item or table.clone(item)
        inv = Inventory(inv)
        local amount = 0
        if inv then
            metadata = not metadata and false or type(metadata) == "string" and {type = metadata} or metadata
            for _, v in pairs(inv.items) do
                if v and v.name == item.name and (not metadata or table.contains(v.metadata, metadata)) then
                    amount = amount + v.amount
                end
            end
        end
        if returnsAmount then
            return amount
        else
            item.amount = amount
            return item
        end
    end
end
RegisterNetEvent("inventory:server:GetItem", Inventory.GetItem)
exports("GetItem", Inventory.GetItem)

function Inventory.GetItemSlots(inv, item, metadata)
    inv = Inventory(inv)
    local totalAmount, slots, emptySlots = 0, {}, inv.slots
    for k, v in pairs(inv.items) do
        emptySlots = emptySlots - 1
        if v.name == item.name then
            if metadata and v.metadata == nil then
                v.metadata = {}
            end
            if not metadata or table.matches(v.metadata, metadata) then
                totalAmount = totalAmount + v.amount
                slots[k] = v.amount
            end
        end
    end
    return slots, totalAmount, emptySlots
end
RegisterNetEvent("inventory:server:GetItemSlots", Inventory.GetItemSlots)
exports("GetItemSlots", Inventory.GetItemSlots)

function Inventory.SetSlot(inv, item, amount, metadata, slot)
    inv = Inventory(inv)
    local currentSlot = inv.items[slot]
    local newAmount = currentSlot and currentSlot.amount + amount or amount
    if currentSlot and newAmount < 1 then
        amount = currentSlot.amount
        inv.items[slot] = nil
    else
        inv.items[slot] = {
            name = item.name,
            label = item.label,
            amount = newAmount,
            metadata = metadata or currentSlot.metadata,
            description = item.description,
            weight = Inventory.GetItemWeight(item, metadata, 1),
            type = item.type,
            unique = item.unique,
            useable = item.useable,
            shouldClose = item.shouldClose,
            slot = slot,
            combinable = item.combinable,
            illustrator = item.illustrator,
        }
        inv.items[slot].weight = Inventory.GetItemWeight(item, inv.items[slot].metadata, inv.items[slot].amount)
    end
    inv.changed = true
end

function Inventory.GetSlot(inv, slot)
    inv = Inventory(inv)
    if not slot then
        return nil
    end

    return inv.items[slot]
end
exports("GetSlot", Inventory.GetSlot)

---
--- Create/Drop storage
---
function GetOrCreateInventory(storageType, invID, ctx)
    local targetInv = Inventory(invID)

    local storageConfig = Config.StorageCapacity["default"]

    if Config.StorageCapacity[storageType] then
        storageConfig = Config.StorageCapacity[storageType]
    end

    if storageType == "bin" then
        targetInv = Inventory("bin_" .. invID)

        if targetInv == nil then
            targetInv = Inventory.Create("bin_" .. invID, invID, storageType, storageConfig.slot, storageConfig.weight, invID)
        end
    elseif storageType == "trunk" or storageType == "brickade" or storageType == "tanker" or storageType == "trailerlogs" or storageType == "trash" or
        storageType == "tiptruck" then
        targetInv = Inventory("trunk_" .. invID)

        if targetInv == nil then
            if not ctx then
                return
            end

            local trunkConfig = QBCore.Shared.Trunks[ctx.class]
            if ctx.model and QBCore.Shared.Trunks[ctx.model] then
                trunkConfig = QBCore.Shared.Trunks[ctx.model]
            end

            local vehicleState = exports["soz-core"]:GetVehicleState(nil, ctx.entity)

            if vehicleState.isPlayerVehicle ~= true then
                storageType = "temporary_trunk"
            end

            targetInv = Inventory.Create("trunk_" .. invID, invID, storageType, trunkConfig.slot, trunkConfig.weight, invID)
        end
    elseif storageType == "stash" then
        targetInv = Inventory("stash_" .. invID)

        if targetInv == nil then
            targetInv = Inventory.Create("stash_" .. invID, invID, storageType, storageConfig.slot, storageConfig.weight, invID)
        end
    elseif storageType == "house_stash" then
        targetInv = Inventory("house_stash_" .. invID)

        local tier = 0
        if ctx then
            tier = exports["soz-core"]:GetApartmentTier(ctx.propertyId, ctx.apartmentId)
        end
        if invID == "villa_cayo" then
            tier = -2
        end

        if targetInv == nil then
            targetInv = Inventory.Create("house_stash_" .. invID, invID, storageType, storageConfig[tier].slot, storageConfig[tier].weight, invID)
        else
            if targetInv.maxWeight ~= storageConfig[tier].weight then
                Inventory.SetHouseStashMaxWeightFromTier(invID, tier)
            end
        end
    elseif storageType == "house_fridge" then
        targetInv = Inventory("house_fridge_" .. invID)

        if targetInv == nil then
            targetInv = Inventory.Create("house_fridge_" .. invID, invID, storageType, storageConfig.slot, storageConfig.weight, invID)
        end
    elseif storageType == "inverter" then
        targetInv = Inventory("inverter_" .. invID)

        if targetInv == nil then
            targetInv = Inventory.Create("inverter_" .. invID, invID, storageType, storageConfig.slot, storageConfig.weight, "upw")
        end
    elseif storageType == "smuggling_box" then
        if targetInv == nil then
            targetInv = Inventory.Create(invID, invID, storageType, storageConfig.slot, storageConfig.weight, invID)
        end
    end

    return targetInv
end
exports("GetOrCreateInventory", GetOrCreateInventory)

--- Create Player Storage
local function CreatePlayerInventory(player --[[PlayerData]] )
    return Inventory.Create(player.source, player.charinfo.firstname .. " " .. player.charinfo.lastname, "player", Config.StorageCapacity["player"].slot,
                            Config.StorageCapacity["player"].weight, player.citizenid)
end

exports("CreatePlayerInventory", CreatePlayerInventory)

--- Drop Player Storage
RegisterNetEvent("inventory:DropPlayerInventory", function(playerID --[[PlayerData]] )
    local inv = Inventory(playerID)

    _G.Container[inv.type]:SaveInventory(inv.id, inv.owner, inv.items)
    Inventory.Remove(playerID)
end)

function getBinItems()
    return {
        ["metalscrap"] = math.random(0, 100) >= 90 and math.random(0, 1) or 0,
        ["aluminum"] = math.random(0, 100) >= 90 and math.random(0, 2) or 0,
        ["rubber"] = math.random(0, 100) >= 90 and math.random(0, 2) or 0,
        ["rolex"] = math.random(0, 100) >= 95 and 1 or 0,
        ["diamond_ring"] = math.random(0, 100) >= 95 and 1 or 0,
        ["goldchain"] = math.random(0, 100) >= 95 and 1 or 0,
        ["garbagebag"] = math.random(5, 20),
    }
end

--- Loops
local function purgeBinLoop()
    for _, inv in pairs(Inventories) do
        if inv.datastore and inv.type == "bin" then
            local items = getBinItems()
            for item, amount in pairs(items) do
                for i = 1, amount do
                    Inventory.AddItem(0, inv, item, 1)
                end
            end
        end
    end

    SetTimeout(math.random(1 * 3600 * 1000, 3 * 3600 * 1000), purgeBinLoop)
end

local function saveInventories(loop)
    if not SyncInventory then
        return
    end

    for _, inv in pairs(Inventories) do
        if not inv.datastore and inv.changed then
            if _G.Container[inv.type]:SaveInventory(inv.id, inv.owner, inv.items) then
                inv.changed = false
            end
        end
    end

    if loop then
        SetTimeout(60000, saveInventories)
    end
end

saveInventories(true)
purgeBinLoop()

-- Events
AddEventHandler("onResourceStart", function(resource)
    if resource == GetCurrentResourceName() then
        for _, Player in pairs(QBCore.Functions.GetQBPlayers()) do
            CreatePlayerInventory(Player.PlayerData)
        end
    end
end)

AddEventHandler("onResourceStop", function(resource)
    if resource == GetCurrentResourceName() then
        saveInventories()
    end
end)

exports("saveInventories", saveInventories)

exports("stopSyncInventories", function()
    SyncInventory = false
end)

_G.Inventory = Inventory
_G.Container = {}

local function GetMetrics()
    local metrics = {}

    for _, inv in pairs(Inventories) do
        table.insert(metrics, {
            id = inv.id,
            label = inv.label,
            type = inv.type,
            slots = inv.slots,
            weight = inv.weight,
            maxWeight = inv.maxWeight,
            owner = inv.owner,
            items = inv.items or {},
        })
    end

    return metrics
end

exports("GetMetrics", GetMetrics)

local function clearByOwner(owner)
    MySQL.query("UPDATE storages SET inventory = ? WHERE owner = ?", {"[]", owner})

    for _, inv in pairs(Inventories) do
        if (inv.owner == owner) then
            Inventory.Clear(inv, false)
        end
    end
end
exports("ClearByOwner", clearByOwner)
