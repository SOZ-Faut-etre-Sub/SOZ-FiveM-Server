QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()
Handle = {}
Handle.Functions = {}

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

RegisterNetEvent("inventory:client:openInventory", function(playerInventory, targetInventory, targetMoney)
    SendNUIMessage({
        action = "openInventory",
        playerInventory = playerInventory,
        playerMoney = PlayerData.money["money"] + PlayerData.money["marked_money"],
        targetInventory = targetInventory,
        targetMoney = targetMoney and (targetMoney["money"] + targetMoney["marked_money"]),
    })
    SetNuiFocus(true, true)
end)

RegisterNetEvent("inventory:client:requestOpenInventory", function(data)
    if data.invType == "bin" then
        local coords = GetEntityCoords(data.entity)
        data.invID = string.format("bin_%.5f+%.5f+%.5f", coords.x, coords.y, coords.z)
    end

    TriggerServerEvent("inventory:server:openInventory", data.invType, data.invID)
end)

function Handle.Functions.handleFish(inventory)
    for _, value in ipairs(PlayerData.metadata.drugs_skills) do
        -- 2 is Zoologiste
        if value == 2 then
            for key, value in pairs(inventory.items) do
                if value.type == "fish" then
                    value.useable = true
                    value.usableLabel = "Ponctionner les toxines"
                end
            end
        end
    end

    return inventory
end

function getAmountFromShortcutModifier(keyModifier, amount, maxAmount)
    local tempAmount = amount

    if amount >= 1 and keyModifier == "CTRL" then
        tempAmount = 1
        return tempAmount
    elseif amount > 1 and keyModifier == "ALT" then
        SetNuiFocus(false, false)
        tempAmount = exports["soz-core"]:Input("Quantité", 5, math.floor(amount / 2))
        SetNuiFocus(true, true)
        return tempAmount

    elseif amount >= 1 then
        if not maxAmount then
            return amount
        end

        local tempAmount = math.min(amount, maxAmount)

        if tempAmount <= 0 then
            exports["soz-core"]:DrawNotification("Cet inventaire est déjà plein", "error")
            return 0
        end

        if maxAmount < amount then
            exports["soz-core"]:DrawNotification(maxAmount .. " objets déplacés", "info")
        end

        return tempAmount
    end
end

RegisterNUICallback("transfertItem", function(data, cb)
    local amount = data.item.amount
    local keyModifier = data.keyModifier
    local targetMaxWeight = tonumber(data.targetMaxWeight)
    local targetCurrentWeight = tonumber(data.targetCurrentWeight)

    local maxAmount = math.floor((targetMaxWeight - targetCurrentWeight) / QBCore.Shared.Items[data.item.name].weight)

    amount = getAmountFromShortcutModifier(keyModifier, amount, maxAmount)

    if not amount or amount == 0 then
        return
    end

    QBCore.Functions.TriggerCallback("inventory:server:TransfertItem", function(success, reason, invSource, invTarget)
        cb({status = success, sourceInventory = invSource, targetInventory = invTarget})
        if not success then
            exports["soz-core"]:DrawNotification(Config.ErrorMessage[reason] or reason, "error")
        elseif success and (invSource.type == "bin" or invTarget.type == "bin") then
            QBCore.Functions.RequestAnimDict("missfbi4prepp1")
            TaskPlayAnim(PlayerPedId(), "missfbi4prepp1", "_bag_pickup_garbage_man", 6.0, -6.0, 2500, 49, 0, 1, 1, 0)
            PlaySoundFrontend(-1, "Collect_Pickup", "DLC_IE_PL_Player_Sounds", true)
        end
    end, data.source, data.target, data.item.name, tonumber(amount) or 0, data.item.metadata, data.item.slot, data.slot)
end)

RegisterNUICallback("transfertMoney", function(data, cb)
    SetNuiFocus(false, false)
    local amount = exports["soz-core"]:Input("Quantité", 12)
    SetNuiFocus(true, true)

    if amount and tonumber(amount) > 0 then

        QBCore.Functions.TriggerCallback("inventory:server:TransfertMoney", function(sourceMoney, targetMoney)
            cb({status = true, sourceMoney = sourceMoney, targetMoney = targetMoney, inverse = data.inverse})
        end, data.target, tonumber(amount), data.inverse)

    else
        cb(false)
    end
end)

RegisterNUICallback("sortItem", function(data, cb)
    local amount = data.item.amount
    local keyModifier = data.keyModifier

    amount = getAmountFromShortcutModifier(keyModifier, amount)

    if not amount or amount == 0 then
        return
    end

    QBCore.Functions.TriggerCallback("inventory:server:TransfertItem", function(success, reason, invSource, invTarget)
        invSource = Handle.Functions.handleFish(invSource)
        cb({status = success, sourceInventory = invSource, targetInventory = invTarget})
        if not success then
            exports["soz-core"]:DrawNotification(Config.ErrorMessage[reason] or reason, "error")
        end
    end, data.inventory, data.inventory, data.item.name, tonumber(amount) or 0, data.item.metadata, data.item.slot, data.slot, data.manualFilter)
end)

RegisterNUICallback("sortInventoryAZ", function(data, cb)
    QBCore.Functions.TriggerCallback("inventory:server:SortInventoryAZ", function(success, reason, invSource)
        cb({status = success, sourceInventory = invSource})
        if not success then
            exports["soz-core"]:DrawNotification(Config.ErrorMessage[reason], "error")
        end
    end, data.inventory)
end)

RegisterNUICallback("closeNUI", function(data, cb)
    inventoryDisableControlsActions(false)
    SetNuiFocus(false, false)
    cb(true)
    if data.target then
        TriggerServerEvent("inventory:server:closeInventory", data.target)
        if string.find(data.target, "trunk") or data.target == "target" then
            TriggerEvent("soz-core:client:vehicle:close-trunk")
        end
    end
end)

RegisterNUICallback("player/askForAmount", function(data, cb)
    SetNuiFocus(false, false)
    amount = exports["soz-core"]:Input("Quantité", 5, 1)
    SetNuiFocus(true, true)
    cb(amount)
end)

CreateThread(function()
    for id, storage in pairs(Config.Storages) do
        local options = {
            {
                label = "Ouvrir",
                icon = "c:inventory/ouvrir_le_stockage.png",
                event = "inventory:client:qTargetOpenInventory",
                storageID = id,
                storage = storage,
                job = storage.owner,
            },
        }
        if storage.targetOptions then
            for _, option in pairs(storage.targetOptions) do
                table.insert(options, option)
            end
        end
        exports["qb-target"]:AddBoxZone("storage:" .. id, storage.position, storage.size and storage.size.x or 1.0, storage.size and storage.size.y or 1.0, {
            name = "storage:" .. id,
            heading = storage.heading or 0.0,
            minZ = storage.minZ or (storage.position.z - (storage.offsetDownZ or 1.0)),
            maxZ = storage.maxZ or (storage.position.z + (storage.offsetUpZ or 1.0)),
            debugPoly = storage.debug or false,
        }, {options = options, distance = 2.5})
    end
end)

RegisterNetEvent("inventory:client:qTargetOpenInventory", function(data)
    if data.storage.owner == nil or (PlayerData.job ~= nil and PlayerData.job.id == data.storage.owner) then
        TriggerServerEvent("inventory:server:openInventory", data.storage.type, data.storageID)
    else
        exports["soz-core"]:DrawNotification("Vous ne pouvez pas utiliser ce stockage", "error")
    end
end)

RegisterNetEvent("inventory:client:closeInventory", function()
    SendNUIMessage({action = "closeInventory"})
end)

RegisterNetEvent("inventory:client:updateTargetStoragesState", function(targetInventory)
    SendNUIMessage({action = "updateInventory", targetInventory = targetInventory})
end)

-- SHOPS

RegisterNetEvent("inventory:client:openShop", function(shopContent, shopHeaderTexture)

    SendNUIMessage({action = "openShop", shopContent = shopContent, shopHeaderTexture = shopHeaderTexture})
    SetNuiFocus(true, true)
end)

exports("openShop", function(shopContent, shopHeaderTexture)
    SendNUIMessage({action = "openShop", shopContent = shopContent, shopHeaderTexture = shopHeaderTexture})
    SetNuiFocus(true, true)
end)

RegisterNUICallback("player/validateCart", function(data, cb)
    SetNuiFocus(false, false)
    local cartContent = data

    TriggerServerEvent("soz-core:server:shop:validate-cart", cartContent)

    SetNuiFocus(true, true)
    cb(amount)
end)
