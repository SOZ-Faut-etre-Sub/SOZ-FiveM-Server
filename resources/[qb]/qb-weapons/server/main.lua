local QBCore = exports['qb-core']:GetCoreObject()

-- Functions

local function IsWeaponBlocked(WeaponName)
    local retval = false
    for _, name in pairs(Config.DurabilityBlockedWeapons) do
        if name == WeaponName then
            retval = true
            break
        end
    end
    return retval
end

local function HasAttachment(component, attachments)
    local retval = false
    local key = nil
    for k, v in pairs(attachments) do
        if v.component == component then
            key = k
            retval = true
        end
    end
    return retval, key
end

local function GetAttachmentType(attachments)
    local attype = nil
    for k,v in pairs(attachments) do
        attype = v.type
    end
    return attype
end

-- Callback

QBCore.Functions.CreateCallback("weapons:server:GetConfig", function(source, cb)
    cb(Config.WeaponRepairPoints)
end)

QBCore.Functions.CreateCallback("weapon:server:GetWeaponAmmo", function(source, cb, WeaponData)
    local Player = QBCore.Functions.GetPlayer(source)
    local retval = 0
    if WeaponData then
        if Player then
            local ItemData = Player.Functions.GetItemBySlot(WeaponData.slot)
            if ItemData then
                retval = ItemData.metadata.ammo and ItemData.metadata.ammo or 0
            end
        end
    end
    cb(retval)
end)

-- Events

RegisterNetEvent("weapons:server:AddWeaponAmmo", function(CurrentWeaponData, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    amount = tonumber(amount)
    if CurrentWeaponData then
        exports['soz-inventory']:SetMetadata(Player.PlayerData.source, CurrentWeaponData.slot, {ammo = amount})
    end
end)

RegisterNetEvent("weapons:server:UpdateWeaponAmmo", function(CurrentWeaponData, amount)
    local player = QBCore.Functions.GetPlayer(source)
    amount = tonumber(amount)
    if CurrentWeaponData then
        exports['soz-inventory']:SetMetadata(player.PlayerData.source, CurrentWeaponData.slot, {ammo = amount})
    end
end)

RegisterNetEvent("weapons:server:SetCurrentWeaponData", function(CurrentWeaponData)
    Player(source).state.CurrentWeaponData = CurrentWeaponData
end)

RegisterNetEvent("weapons:server:TakeBackWeapon", function(k, data)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    local itemdata = Config.WeaponRepairPoints[k].RepairingData.WeaponData
    itemdata.metadata.quality = 100
    exports['soz-inventory']:AddItem(Player.PlayerData.source, itemdata.name, 1, false, itemdata.info)
    Config.WeaponRepairPoints[k].IsRepairing = false
    Config.WeaponRepairPoints[k].RepairingData = {}
    TriggerClientEvent('weapons:client:SyncRepairShops', -1, Config.WeaponRepairPoints[k], k)
end)

RegisterNetEvent("weapons:server:RemoveFireExtinguisher", function()
    local Player = QBCore.Functions.GetPlayer(source)

    local slots = exports["soz-inventory"]:GetItemSlots(Player.PlayerData.source, {name = "weapon_fireextinguisher"})
    for slot, _ in pairs(slots) do
        local item = exports["soz-inventory"]:GetSlot(Player.PlayerData.source, slot)

        if item then
            exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item, 1, item.metadata, slot)
            return
        end
    end
end)

-- Commands

QBCore.Commands.Add("repairweapon", "Repair Weapon (God Only)", {{name="hp", help="HP of ur weapon"}}, true, function(source, args)
    TriggerClientEvent('weapons:client:SetWeaponQuality', source, tonumber(args[1]))
end, "god")
