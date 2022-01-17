local inventoryMenu = MenuV:CreateMenu("Inventaire", "", 255, 0, 0, "default", "soz", "inventory")
local currentWeapon, CurrentWeaponData = nil, {}

local function MoneyMenu()
    local moneyMenu = MenuV:InheritMenu(inventoryMenu, {Subtitle = "Argent"})
    local playerMoney = PlayerData.money["money"] + PlayerData.money["marked_money"]

    inventoryMenu:AddButton({label = "Votre argent", rightLabel = playerMoney .. "$", value = moneyMenu})

    local function giveMoney(button)
        local player, distance = QBCore.Functions.GetClosestPlayer()
        if player ~= -1 and distance < 2.0 then
            local amount = exports["soz-hud"]:Input("Quantité", 12)

            if amount and tonumber(amount) > 0 then
                SetCurrentPedWeapon(PlayerPedId(), "WEAPON_UNARMED", true)
                TriggerServerEvent("inventory:server:GiveMoney", GetPlayerServerId(player), button.Value, tonumber(amount))

                moneyMenu:Close()
                inventoryMenu:Close()
            end
        else
            exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous")
        end
    end

    local giveMoneyItem = moneyMenu:AddButton({label = "Donner de l'argent", value = "money"})
    local giveMarkedMoneyItem = moneyMenu:AddButton({label = "Donner de l'argent sale", value = "marked_money"})
    giveMoneyItem:On("select", giveMoney)
    giveMarkedMoneyItem:On("select", giveMoney)
end

local function ItemsMenu(items)
    local playerWeight = 0

    for _, item in pairs(items) do
        local itemMenu = MenuV:InheritMenu(inventoryMenu, {Subtitle = item.label})
        playerWeight = playerWeight + item.weight

        if item.useable or item.type == "weapon" then
            local label = "Utiliser"
            if item.type == "weapon" then
                label = "Équiper"
            end

            local use = itemMenu:AddButton({label = label, value = item, description = ""})
            use:On("select", function(i)
                TriggerServerEvent("inventory:server:UseItemSlot", i.Value.slot)

                itemMenu:Close()
                inventoryMenu:Close()
            end)
        end

        local give = itemMenu:AddButton({label = "Donner", value = item, description = ""})
        give:On("select", function(i)
            local player, distance = QBCore.Functions.GetClosestPlayer()
            if player ~= -1 and distance < 2.0 then
                local amount = exports["soz-hud"]:Input("Quantité", 5, item.amount)

                if amount and tonumber(amount) > 0 then
                    SetCurrentPedWeapon(PlayerPedId(), "WEAPON_UNARMED", true)
                    TriggerServerEvent("inventory:server:GiveItem", GetPlayerServerId(player), i.Value, tonumber(amount))

                    itemMenu:Close()
                    inventoryMenu:Close()
                end
            else
                exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous")
            end
        end)

        inventoryMenu:AddButton({
            label = item.label,
            rightLabel = item.amount,
            value = itemMenu,
            description = item.description,
        })
    end

    return playerWeight
end

RegisterKeyMapping("inventory", "Ouvrir l'inventaire", "keyboard", "F2")
RegisterCommand("inventory", function()
    QBCore.Functions.TriggerCallback("inventory:server:openPlayerInventory", function(inventory)
        if inventory ~= nil then
            if not PlayerData.metadata["isdead"] and not PlayerData.metadata["inlaststand"] and not PlayerData.metadata["ishandcuffed"] and
                not IsPauseMenuActive() then
                inventoryMenu:ClearItems()
                inventoryMenu:SetSubtitle(string.format("%s/%s Kg", inventory.weight / 1000, inventory.maxWeight / 1000))

                MoneyMenu()
                ItemsMenu(inventory.items)

                if inventoryMenu.IsOpen then
                    inventoryMenu:Close()
                else
                    inventoryMenu:Open()
                end
            end
        end
    end, "player", source)
end, false)

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
        end, CurrentWeaponData)
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
