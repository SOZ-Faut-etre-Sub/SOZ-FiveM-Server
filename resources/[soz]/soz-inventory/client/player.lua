RegisterKeyMapping("inventory", "Ouvrir l'inventaire", "keyboard", "F2")
RegisterCommand("inventory", function()
    if PlayerData.metadata["isdead"] or PlayerData.metadata["inlaststand"] or PlayerData.metadata["ishandcuffed"] or IsPauseMenuActive() or IsNuiFocused() then
        return
    end

    exports["menuv"]:SendNUIMessage({action = "KEY_CLOSE_ALL"})
    TriggerEvent("soz-core:client:menu:close", false)

    QBCore.Functions.TriggerCallback("inventory:server:openPlayerInventory", function(inventory)
        if inventory ~= nil then
            local playerState = exports["soz-core"]:GetPlayerState()

            if playerState.isInventoryBusy then
                exports["soz-core"]:DrawNotification("Inventaire en cours d'utilisation", "warning")
                return
            end

            inventory = Handle.Functions.handleFish(inventory)

            SendNUIMessage({
                action = "openPlayerInventory",
                playerInventory = inventory,
                playerMoney = PlayerData.money["money"] + PlayerData.money["marked_money"],
                playerShortcuts = PlayerData.metadata["shortcuts"] or {},
            })
            SetNuiFocus(true, true)
            InventoryOpen = true

            --- Force player to stop using weapon if input is pressed while inventory is open
            SetNuiFocusKeepInput(true)
            inventoryDisableControlsActions(true)
            Wait(50)
            SetNuiFocusKeepInput(false)
        end
    end, "player")
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

RegisterNUICallback("player/renameItem", function(data, cb)
    SetNuiFocus(false, false)
    local label = exports["soz-core"]:Input("Étiquette", 20, "")
    TriggerServerEvent("inventory:server:renameItem", label, data)
    cb(true)
end)

RegisterNUICallback("player/giveItem", function(data, cb)
    SetNuiFocus(false, false)

    local playerState = exports["soz-core"]:GetPlayerState()

    if playerState.isInHub then
        exports["soz-core"]:DrawNotification("Pas d'échange dans le Hub", "error")
    else
        local player, distance = QBCore.Functions.GetClosestPlayer()
        if player ~= -1 and distance < 2.0 then
            local amount = data.amount

            if amount > 1 then
                amount = exports["soz-core"]:Input("Quantité", 5, data.amount)
            end

            if tonumber(amount, 10) == nil then
                exports["soz-core"]:DrawNotification("Vous devez entrer un nombre entier", "error")
                cb(true)
                return
            end

            if amount and tonumber(amount) > 0 then
                TriggerServerEvent("inventory:server:GiveItem", GetPlayerServerId(player), data, tonumber(amount))
            end
        else
            exports["soz-core"]:DrawNotification("Personne n'est à portée de vous", "error")
        end
    end

    cb(true)
end)

RegisterNUICallback("player/giveMoney", function(data, cb)
    SetNuiFocus(false, false)

    local playerState = exports["soz-core"]:GetPlayerState()

    if playerState.isInHub then
        exports["soz-core"]:DrawNotification("Pas d'échange dans le Hub", "error")
    else
        local player, distance = QBCore.Functions.GetClosestPlayer()
        if player ~= -1 and distance < 2.0 then
            local amount = exports["soz-core"]:Input("Quantité", 12)

            if amount and tonumber(amount) > 0 then
                TriggerServerEvent("inventory:server:GiveMoney", GetPlayerServerId(player), "money", math.ceil(tonumber(amount)))
            end
        else
            exports["soz-core"]:DrawNotification("Personne n'est à portée de vous", "error")
        end
    end

    cb(true)
end)

RegisterNUICallback("player/giveMarkedMoney", function(data, cb)
    SetNuiFocus(false, false)

    local playerState = exports["soz-core"]:GetPlayerState()

    if playerState.isInHub then
        exports["soz-core"]:DrawNotification("Pas d'échange dans le Hub", "error")
    else
        local player, distance = QBCore.Functions.GetClosestPlayer()
        if player ~= -1 and distance < 2.0 then
            local amount = exports["soz-core"]:Input("Quantité", 12)

            if amount and tonumber(amount) > 0 then
                TriggerServerEvent("inventory:server:GiveMoney", GetPlayerServerId(player), "marked_money", math.ceil(tonumber(amount)))
            end
        else
            exports["soz-core"]:DrawNotification("Personne n'est à portée de vous", "error")
        end
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
            amount = exports["soz-core"]:Input("Quantité", 5, data.amount)
        end

        if amount and tonumber(amount) > 0 then
            local playerIdx = NetworkGetPlayerIndexFromPed(entityHit)
            if playerIdx == -1 then -- Is NPC
                if currentResellZone ~= nil then
                    TriggerServerEvent("inventory:server:ResellItem", data, tonumber(amount), currentResellZone)
                else
                    exports["soz-core"]:DrawNotification("Vous n'êtes pas dans une zone de revente", "error")
                end
            else
                local playerState = exports["soz-core"]:GetPlayerState()

                if playerState.isInHub then
                    exports["soz-core"]:DrawNotification("Pas d'échange dans le Hub", "error")
                else
                    TriggerServerEvent("inventory:server:GiveItem", GetPlayerServerId(playerIdx), data, tonumber(amount))
                end
            end
        end
    else
        exports["soz-core"]:DrawNotification("Personne n'est à portée de vous", "error")
    end

    cb(true)
end)

RegisterNUICallback("player/giveMoneyToTarget", function(data, cb)
    local hit, _, _, entityHit, entityType, _ = ScreenToWorld()
    SetNuiFocus(false, false)

    local playerState = exports["soz-core"]:GetPlayerState()

    if playerState.isInHub then
        exports["soz-core"]:DrawNotification("Pas d'échange dans le Hub", "error")
    else
        if hit == 1 and entityType == 1 then
            local amount = exports["soz-core"]:Input("Quantité", 12)

            if amount and tonumber(amount) > 0 then
                local playerIdx = NetworkGetPlayerIndexFromPed(entityHit)
                if playerIdx == -1 then -- Is NPC
                    exports["soz-core"]:DrawNotification("Personne n'est à portée de vous", "error")
                else
                    TriggerServerEvent("inventory:server:GiveMoney", GetPlayerServerId(playerIdx), "money", math.ceil(tonumber(amount)))
                end
            end
        else
            exports["soz-core"]:DrawNotification("Personne n'est à portée de vous", "error")
        end
    end

    cb(true)
end)

exports("hasPhone", function()
    if IsPauseMenuActive() then
        return false
    end

    local hasphone = false
    for _, item in pairs(PlayerData.items) do
        if item.name == "phone" then
            hasphone = true
            break
        end
    end

    if not hasphone then
        exports["soz-core"]:DrawNotification("Vous n'avez pas de téléphone", "error");
        return false
    end

    local playerState = exports["soz-core"]:GetPlayerState()

    if playerState.isInventoryBusy then
        exports["soz-core"]:DrawNotification("Action en cours", "error")
        return false
    end

    if PlayerData.metadata["inlaststand"] or PlayerData.metadata["ishandcuffed"] then
        exports["soz-core"]:DrawNotification("Vous ne pouvez pas accéder à votre téléphone", "error")
        return false
    end

    return true;
end)
