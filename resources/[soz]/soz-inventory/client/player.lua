local currentWeapon = nil
local currentWeaponData = nil

RegisterKeyMapping("inventory", "Ouvrir l'inventaire", "keyboard", "F2")
RegisterCommand("inventory", function()
    if PlayerData.metadata["isdead"] or PlayerData.metadata["inlaststand"] or PlayerData.metadata["ishandcuffed"] or IsPauseMenuActive() then
        return
    end

    exports["menuv"]:SendNUIMessage({action = "KEY_CLOSE_ALL"})
    TriggerEvent("soz-core:client:menu:close", false)
    QBCore.Functions.TriggerCallback("inventory:server:openPlayerInventory", function(inventory)
        if inventory ~= nil then
            SendNUIMessage({
                action = "openPlayerInventory",
                playerInventory = inventory,
                playerMoney = PlayerData.money["money"] + PlayerData.money["marked_money"],
            })
            SetNuiFocus(true, true)

            --- Force player to stop using weapon if input is pressed while inventory is open
            SetNuiFocusKeepInput(true)
            Wait(50)
            SetNuiFocusKeepInput(false)
        end
    end, "player", source)
end, false)

RegisterNUICallback("player/useItem", function(data, cb)
    SetNuiFocus(false, false)
    TriggerServerEvent("inventory:server:UseItemSlot", data.slot)
    cb(true)
end)

RegisterNUICallback("player/setItemUsage", function(data, cb)
    SetNuiFocus(false, false)
    TriggerServerEvent("soz-core:server:inventory:set-item-usage", data.shortcut, data.slot)
    cb(true)
end)

RegisterNUICallback("player/giveItem", function(data, cb)
    SetNuiFocus(false, false)

    local player, distance = QBCore.Functions.GetClosestPlayer()
    if player ~= -1 and distance < 2.0 then
        local amount = data.amount

        if amount > 1 then
            amount = exports["soz-hud"]:Input("Quantité", 5, data.amount)
        end

        if amount and tonumber(amount) > 0 then
            TriggerEvent("inventory:client:StoreWeapon")
            TriggerServerEvent("inventory:server:GiveItem", GetPlayerServerId(player), data, tonumber(amount))
        end
    else
        exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
    end

    cb(true)
end)

RegisterNUICallback("player/giveMoney", function(data, cb)
    SetNuiFocus(false, false)

    local player, distance = QBCore.Functions.GetClosestPlayer()
    if player ~= -1 and distance < 2.0 then
        local amount = exports["soz-hud"]:Input("Quantité", 12)

        if amount and tonumber(amount) > 0 then
            TriggerEvent("inventory:client:StoreWeapon")
            TriggerServerEvent("inventory:server:GiveMoney", GetPlayerServerId(player), "money", math.ceil(tonumber(amount)))
        end
    else
        exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
    end

    cb(true)
end)

RegisterNUICallback("player/giveMarkedMoney", function(data, cb)
    SetNuiFocus(false, false)

    local player, distance = QBCore.Functions.GetClosestPlayer()
    if player ~= -1 and distance < 2.0 then
        local amount = exports["soz-hud"]:Input("Quantité", 12)

        if amount and tonumber(amount) > 0 then
            TriggerEvent("inventory:client:StoreWeapon")
            TriggerServerEvent("inventory:server:GiveMoney", GetPlayerServerId(player), "marked_money", math.ceil(tonumber(amount)))
        end
    else
        exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
    end

    cb(true)
end)

local currentResellZone = nil
AddEventHandler("player/setCurrentResellZone", function(newValue)
    currentResellZone = newValue
end)

RegisterNUICallback("player/giveItemToTarget", function(data, cb)
    local hit, _, _, entityHit, entityType, _ = ScreenToWorld()
    SetNuiFocus(false, false)

    if hit == 1 and entityType == 1 then
        local amount = data.amount

        if amount > 1 then
            amount = exports["soz-hud"]:Input("Quantité", 5, data.amount)
        end

        if amount and tonumber(amount) > 0 then
            TriggerEvent("inventory:client:StoreWeapon")
            local playerIdx = NetworkGetPlayerIndexFromPed(entityHit)
            if playerIdx == -1 then -- Is NPC
                if currentResellZone ~= nil then
                    TriggerServerEvent("inventory:server:ResellItem", data, tonumber(amount), currentResellZone)
                end
            else
                TriggerServerEvent("inventory:server:GiveItem", GetPlayerServerId(playerIdx), data, tonumber(amount))
            end
        end
    else
        exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
    end

    cb(true)
end)

RegisterNetEvent("inventory:client:StoreWeapon", function()
    local ped = PlayerPedId()
    if currentWeapon ~= nil then
        local _, hash = GetCurrentPedWeapon(ped, true)
        TriggerServerEvent("weapons:server:UpdateWeaponAmmo", currentWeaponData, GetAmmoInPedWeapon(ped, hash))

        SetCurrentPedWeapon(ped, GetHashKey("WEAPON_UNARMED"), true)
        RemoveAllPedWeapons(ped, true)
        TriggerEvent("weapons:client:SetCurrentWeapon", nil, true)
        currentWeapon = nil
        currentWeaponData = nil
    end
end)

RegisterNetEvent("inventory:client:UseWeapon", function(weaponData, shootbool)
    local ped = PlayerPedId()
    local weaponName = tostring(weaponData.name)
    if currentWeapon == weaponName then
        local _, hash = GetCurrentPedWeapon(ped, true)
        TriggerServerEvent("weapons:server:UpdateWeaponAmmo", weaponData, GetAmmoInPedWeapon(ped, hash))

        SetCurrentPedWeapon(ped, GetHashKey("WEAPON_UNARMED"), true)
        RemoveAllPedWeapons(ped, true)

        TriggerEvent("weapons:client:SetCurrentWeapon", nil, shootbool)
        currentWeapon = nil
        currentWeaponData = nil
    elseif weaponName == "weapon_stickybomb" or weaponName == "weapon_pipebomb" or weaponName == "weapon_smokegrenade" or weaponName == "weapon_flare" or
        weaponName == "weapon_proxmine" or weaponName == "weapon_ball" or weaponName == "weapon_molotov" or weaponName == "weapon_grenade" or weaponName ==
        "weapon_bzgas" then
        GiveWeaponToPed(ped, GetHashKey(weaponName), 1, false, false)
        SetPedAmmo(ped, GetHashKey(weaponName), 1)
        SetCurrentPedWeapon(ped, GetHashKey(weaponName), true)
        TriggerEvent("weapons:client:SetCurrentWeapon", weaponData, shootbool)
        currentWeapon = weaponName
        currentWeaponData = weaponData
    elseif weaponName == "weapon_snowball" then
        GiveWeaponToPed(ped, GetHashKey(weaponName), 10, false, false)
        SetPedAmmo(ped, GetHashKey(weaponName), 10)
        SetCurrentPedWeapon(ped, GetHashKey(weaponName), true)
        TriggerServerEvent("QBCore:Server:RemoveItem", weaponName, 1)
        TriggerEvent("weapons:client:SetCurrentWeapon", weaponData, shootbool)
        currentWeapon = weaponName
        currentWeaponData = weaponData
    else
        TriggerEvent("weapons:client:SetCurrentWeapon", weaponData, shootbool)
        QBCore.Functions.TriggerCallback("weapon:server:GetWeaponAmmo", function(result)
            local ammo = tonumber(result)
            GiveWeaponToPed(ped, GetHashKey(weaponName), 0, false, false)
            SetPedAmmo(ped, GetHashKey(weaponName), ammo)
            SetCurrentPedWeapon(ped, GetHashKey(weaponName), true)
            if weaponData.metadata.attachments ~= nil then
                for _, attachment in pairs(weaponData.metadata.attachments) do
                    GiveWeaponComponentToPed(ped, GetHashKey(weaponName), GetHashKey(attachment.component))
                end
            end
            currentWeapon = weaponName
            currentWeaponData = weaponData
        end, weaponData)
    end
end)

exports("hasPhone", function()
    local p = promise.new()
    QBCore.Functions.TriggerCallback("inventory:server:openPlayerInventory", function(inventory)
        if inventory == nil then
            p:resolve(false)
            return
        end

        if PlayerData.metadata["isdead"] or PlayerData.metadata["inlaststand"] or PlayerData.metadata["ishandcuffed"] or IsPauseMenuActive() then
            p:resolve(false)
            return
        end

        for _, item in pairs(inventory.items) do
            if item.name == "phone" then
                p:resolve(true)
                return
            end
        end

        p:resolve(false)
    end, "player", PlayerId())

    return Citizen.Await(p)
end)
