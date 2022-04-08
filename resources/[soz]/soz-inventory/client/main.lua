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

RegisterNetEvent("inventory:client:openInventory", function(playerInventory, targetInventory)
    SendNUIMessage({action = "openInventory", playerInventory = playerInventory, targetInventory = targetInventory})
    SetNuiFocus(true, true)
end)

RegisterNetEvent("inventory:client:requestOpenInventory", function(data)
    if data.invType == "bin" then
        local coords = GetEntityCoords(data.entity)
        data.invID = string.format("bin_%.5f+%.5f+%.5f", coords.x, coords.y, coords.z)
    end

    TriggerServerEvent("inventory:server:openInventory", data.invType, data.invID)
end)

RegisterNUICallback("transfertItem", function(data, cb)
    SetNuiFocus(false, false)
    local amount = exports["soz-hud"]:Input("Quantité", 5, data.item.amount)
    SetNuiFocus(true, true)

    if amount and tonumber(amount) then
        QBCore.Functions.TriggerCallback("inventory:server:TransfertItem", function(success, reason, invSource, invTarget)
            cb({status = success, sourceInventory = invSource, targetInventory = invTarget})
            if not success then
                exports["soz-hud"]:DrawNotification(Config.ErrorMessage[reason], "error")
            elseif success and (invSource.type == "bin" or invTarget.type == "bin") then
                QBCore.Functions.RequestAnimDict("missfbi4prepp1")
                TaskPlayAnim(PlayerPedId(), "missfbi4prepp1", "_bag_pickup_garbage_man", 6.0, -6.0, 2500, 49, 0, 1, 1, 1)
                PlaySoundFrontend(-1, "Collect_Pickup", "DLC_IE_PL_Player_Sounds", true)
            end
        end, data.source, data.target, data.item.name, amount, data.item.slot)
    else
        cb({status = false})
    end
end)

RegisterNUICallback("closeNUI", function(data, cb)
    SetNuiFocus(false, false)
    TriggerServerEvent("inventory:server:closeInventory", data.target)
    cb(true)
end)

CreateThread(function()
    for id, storage in pairs(Config.Storages) do
        exports["qb-target"]:AddBoxZone("storage:" .. id, storage.position, storage.size and storage.size.x or 1.0, storage.size and storage.size.y or 1.0, {
            name = "storage:" .. id,
            heading = storage.heading or 0.0,
            minZ = storage.position.z - (storage.offsetDownZ or 1.0),
            maxZ = storage.position.z + (storage.offsetUpZ or 1.0),
            debugPoly = storage.debug or false,
        }, {
            options = {
                {
                    label = "Ouvrir le stockage",
                    icon = "fas fa-box-open",
                    event = "inventory:client:qTargetOpenInventory",
                    storageID = id,
                    storage = storage,
                    job = storage.owner,
                },
            },
            distance = 2.5,
        })
    end
end)

RegisterNetEvent("inventory:client:qTargetOpenInventory", function(data)
    if data.storage.owner == nil or (PlayerData.job ~= nil and PlayerData.job.id == data.storage.owner) then
        if data.storage.state == nil then
            TriggerServerEvent("inventory:server:openInventory", data.storage.type, data.storageID)
        else
            exports["soz-hud"]:DrawNotification("Stockage déjà utilisé", "warning")
        end
    else
        exports["soz-hud"]:DrawNotification("Vous ne pouvez pas utiliser ce stockage", "error")
    end
end)

RegisterNetEvent("inventory:client:updateStorageState", function(name, state)
    if Config.Storages[name] then
        Config.Storages[name].state = state
    end
end)

CreateThread(function()
    RequestStreamedTextureDict("soz-items", false)
    while not HasStreamedTextureDictLoaded("soz-items") do
        Wait(100)
    end
end)
