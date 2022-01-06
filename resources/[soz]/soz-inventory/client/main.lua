QBCore = exports['qb-core']:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()


RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    LocalPlayer.state:set("inv_busy", false, true)
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent('QBCore:Player:SetPlayerData', function(data)
    PlayerData = data
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    LocalPlayer.state:set("inv_busy", true, true)
end)

RegisterNetEvent('inventory:client:openInventory', function(playerInventory, targetInventory)
    SendNUIMessage({
        action = 'openInventory',
        playerInventory = playerInventory,
        targetInventory = targetInventory,
    })
    SetNuiFocus(true, true)
end)

RegisterNUICallback('transfertItem', function(data, cb)
    SetNuiFocus(false, false)
    local amount = exports['soz-hud']:Input("Quantité", 5, data.item.amount)
    SetNuiFocus(true, true)

    if amount and tonumber(amount) then
        QBCore.Functions.TriggerCallback("inventory:server:TransfertItem", function(success, reason, invSource, invTarget)
            cb({
                status = success,
                sourceInventory = invSource,
                targetInventory = invTarget
            })
            if not success then
                exports['soz-hud']:DrawNotification(Config.ErrorMessage[reason])
            end
        end, data.source, data.target, data.item.name, amount, data.item.slot)
    else
        cb({ status = false })
    end
end)

RegisterNUICallback('closeNUI', function(data, cb)
    SetNuiFocus(false, false)
    cb(true)
end)


CreateThread(function()
    while true do
        for id,storage in pairs(Config.Storages) do
            local dist = #(GetEntityCoords(PlayerPedId()) - storage.position)

            if dist <= 80.0 then
                DrawMarker(27,
                        storage.position.x, storage.position.y, storage.position.z,
                        0.0, 0.0, 0.0,
                        0.0, 180.0, 0.0,
                        1.5, 1.5, 1.5,
                        255, 128, 0, 50,
                        false, false, 2)

                if dist <= 2.0 then
                    QBCore.Functions.ShowHelpNotification("~INPUT_CONTEXT~ Pour accéder à ~b~" .. storage.label)
                    if IsControlPressed(1, 51) then
                        TriggerServerEvent('inventory:server:openInventory', id)
                    end
                end
            end
        end

        Wait(2)
    end
end)

