local currentWeapon = nil

RegisterKeyMapping("inventory", "Ouvrir l'inventaire", "keyboard", "F2")
RegisterCommand("inventory", function()
    if PlayerData.metadata["isdead"] or PlayerData.metadata["inlaststand"] or PlayerData.metadata["ishandcuffed"] or IsPauseMenuActive() then
        return
    end

    QBCore.Functions.TriggerCallback("inventory:server:openPlayerInventory", function(inventory)
        if inventory ~= nil then
            SendNUIMessage({
                action = "openPlayerInventory",
                playerInventory = inventory,
                playerMoney = PlayerData.money["money"] + PlayerData.money["marked_money"],
            })
            SetNuiFocus(true, true)
        end
    end, "player", source)
end, false)

RegisterNUICallback("player/useItem", function(data, cb)
    SetNuiFocus(false, false)
    TriggerServerEvent("inventory:server:UseItemSlot", data.slot)
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
            SetCurrentPedWeapon(PlayerPedId(), "WEAPON_UNARMED", true)
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
            SetCurrentPedWeapon(PlayerPedId(), "WEAPON_UNARMED", true)
            TriggerServerEvent("inventory:server:GiveMoney", GetPlayerServerId(player), "money", tonumber(amount))
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
            SetCurrentPedWeapon(PlayerPedId(), "WEAPON_UNARMED", true)
            TriggerServerEvent("inventory:server:GiveMoney", GetPlayerServerId(player), "marked_money", tonumber(amount))
        end
    else
        exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
    end

    cb(true)
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
            SetCurrentPedWeapon(PlayerPedId(), "WEAPON_UNARMED", true)
            TriggerServerEvent("inventory:server:GiveItem", GetPlayerServerId(NetworkGetPlayerIndexFromPed(entityHit)), data, tonumber(amount))
        end
    else
        exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
    end

    cb(true)
end)

RegisterNetEvent("inventory:client:UseWeapon", function(weaponData, shootbool)
    local ped = PlayerPedId()
    local weaponName = tostring(weaponData.name)
    if currentWeapon == weaponName then
        SetCurrentPedWeapon(ped, GetHashKey("WEAPON_UNARMED"), true)
        RemoveAllPedWeapons(ped, true)
        TriggerEvent("weapons:client:SetCurrentWeapon", nil, shootbool)
        currentWeapon = nil
    elseif weaponName == "weapon_stickybomb" or weaponName == "weapon_pipebomb" or weaponName == "weapon_smokegrenade" or weaponName == "weapon_flare" or
        weaponName == "weapon_proxmine" or weaponName == "weapon_ball" or weaponName == "weapon_molotov" or weaponName == "weapon_grenade" or weaponName ==
        "weapon_bzgas" then
        GiveWeaponToPed(ped, GetHashKey(weaponName), 1, false, false)
        SetPedAmmo(ped, GetHashKey(weaponName), 1)
        SetCurrentPedWeapon(ped, GetHashKey(weaponName), true)
        TriggerEvent("weapons:client:SetCurrentWeapon", weaponData, shootbool)
        currentWeapon = weaponName
    elseif weaponName == "weapon_snowball" then
        GiveWeaponToPed(ped, GetHashKey(weaponName), 10, false, false)
        SetPedAmmo(ped, GetHashKey(weaponName), 10)
        SetCurrentPedWeapon(ped, GetHashKey(weaponName), true)
        TriggerServerEvent("QBCore:Server:RemoveItem", weaponName, 1)
        TriggerEvent("weapons:client:SetCurrentWeapon", weaponData, shootbool)
        currentWeapon = weaponName
    else
        TriggerEvent("weapons:client:SetCurrentWeapon", weaponData, shootbool)
        QBCore.Functions.TriggerCallback("weapon:server:GetWeaponAmmo", function(result)
            local ammo = tonumber(result)
            if weaponName == "weapon_petrolcan" or weaponName == "weapon_fireextinguisher" then
                ammo = 4000
            end
            GiveWeaponToPed(ped, GetHashKey(weaponName), 0, false, false)
            SetPedAmmo(ped, GetHashKey(weaponName), ammo)
            SetCurrentPedWeapon(ped, GetHashKey(weaponName), true)
            if weaponData.metadata.attachments ~= nil then
                for _, attachment in pairs(weaponData.metadata.attachments) do
                    GiveWeaponComponentToPed(ped, GetHashKey(weaponName), GetHashKey(attachment.component))
                end
            end
            currentWeapon = weaponName
        end, weaponData)
    end
end)

exports("hasPhone", function()
    local p = promise.new()
    QBCore.Functions.TriggerCallback("inventory:server:openPlayerInventory", function(inventory)
        if inventory ~= nil then
            if not PlayerData.metadata["isdead"] and not PlayerData.metadata["inlaststand"] and not PlayerData.metadata["ishandcuffed"] and
                not IsPauseMenuActive() then
                for _, item in pairs(inventory.items) do
                    if item.name == "phone" then
                        p:resolve(true)
                        break
                    end
                end
                p:resolve(false)
            end
        end
    end, "player", PlayerId())

    return Citizen.Await(p)
end)
