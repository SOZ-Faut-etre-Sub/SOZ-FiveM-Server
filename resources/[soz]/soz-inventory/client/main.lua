QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    LocalPlayer.state:set("inv_busy", false, true)
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

RegisterNetEvent("QBCore:Client:OnPlayerUnload", function()
    LocalPlayer.state:set("inv_busy", true, true)
end)

RegisterNetEvent("inventory:client:openInventory", function(playerInventory, targetInventory, targetMoney)
    TriggerEvent("inventory:client:StoreWeapon")
    SendNUIMessage({
        action = "openInventory",
        playerInventory = playerInventory,
        playerMoney = PlayerData.money["money"] + PlayerData.money["marked_money"],
        targetInventory = targetInventory,
        targetMoney = targetMoney and (targetMoney["money"] + targetMoney["marked_money"]),
    })
    SetNuiFocus(true, true)
end)

RegisterNUICallback("transfertItem", function(data, cb)
    local amount = data.item.amount

    if amount > 1 then
        SetNuiFocus(false, false)
        amount = exports["soz-hud"]:Input("Quantité", 5, data.item.amount)
        SetNuiFocus(true, true)
    end

    QBCore.Functions.TriggerCallback("inventory:server:TransfertItem", function(success, reason, invSource, invTarget)
        cb({status = success, sourceInventory = invSource, targetInventory = invTarget})
        if not success then
            exports["soz-hud"]:DrawNotification(Config.ErrorMessage[reason], "error")
        elseif success and (invSource.type == "bin" or invTarget.type == "bin") then
            QBCore.Functions.RequestAnimDict("missfbi4prepp1")
            TaskPlayAnim(PlayerPedId(), "missfbi4prepp1", "_bag_pickup_garbage_man", 6.0, -6.0, 2500, 49, 0, 1, 1, 0)
            PlaySoundFrontend(-1, "Collect_Pickup", "DLC_IE_PL_Player_Sounds", true)
        end
    end, data.source, data.target, data.item.name, tonumber(amount) or 0, data.item.metadata, data.item.slot, data.slot)
end)

function indentation(s, indent)
    for i = 1, indent do
        s = "  " .. s
    end
    return s
end

function dump(o, indent)
    if not indent then
        indent = 0
    end
    if type(o) == "table" then
        local s = "{\n"
        for k, v in pairs(o) do
            if type(k) ~= "number" then
                k = "\"" .. k .. "\""
            end
            s = s .. indentation("[" .. k .. "] = " .. dump(v, indent + 1) .. ",\n", indent + 1)
        end
        return s .. indentation("}", indent)
    else
        return tostring(o)
    end
end

RegisterNUICallback("transfertMoney", function(data, cb)
    SetNuiFocus(false, false)
    local amount = exports["soz-hud"]:Input("Quantité", 12)
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
    QBCore.Functions.TriggerCallback("inventory:server:TransfertItem", function(success, reason, invSource, invTarget)
        cb({status = success, sourceInventory = invSource, targetInventory = invTarget})
        if not success then
            exports["soz-hud"]:DrawNotification(Config.ErrorMessage[reason], "error")
        end
    end, data.inventory, data.inventory, data.item.name, data.item.amount, data.item.metadata, data.item.slot, data.slot, data.manualFilter)
end)

RegisterNUICallback("sortInventoryAZ", function(data, cb)
    QBCore.Functions.TriggerCallback("inventory:server:SortInventoryAZ", function(success, reason, invSource)
        cb({status = success, sourceInventory = invSource})
        if not success then
            exports["soz-hud"]:DrawNotification(Config.ErrorMessage[reason], "error")
        end
    end, data.inventory)
end)

RegisterNUICallback("closeNUI", function(data, cb)
    SetNuiFocus(false, false)
    cb(true)
    if data.target then
        TriggerServerEvent("inventory:server:closeInventory", data.target)
        if string.find(data.target, "trunk") or data.target == "target" then
            TriggerEvent("soz-core:client:vehicle:close-trunk")
        end
    end
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
        exports["soz-hud"]:DrawNotification("Vous ne pouvez pas utiliser ce stockage", "error")
    end
end)

RegisterNetEvent("inventory:client:closeInventory", function()
    SendNUIMessage({action = "closeInventory"})
end)

RegisterNetEvent("inventory:client:updateTargetStoragesState", function(targetInventory)
    SendNUIMessage({action = "updateInventory", targetInventory = targetInventory})
end)

CreateThread(function()
    RequestStreamedTextureDict("soz-items", false)
    while not HasStreamedTextureDictLoaded("soz-items") do
        Wait(100)
    end
end)
