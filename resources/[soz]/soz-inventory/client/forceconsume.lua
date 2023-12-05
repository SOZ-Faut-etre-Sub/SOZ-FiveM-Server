AddEventHandler("inventory:client:force-consume", function(targetId)
    exports["menuv"]:SendNUIMessage({action = "KEY_CLOSE_ALL"})
    TriggerEvent("soz-core:client:menu:close", false)
    QBCore.Functions.TriggerCallback("inventory:server:openPlayerInventory", function(inventory)
        if inventory ~= nil then
            SendNUIMessage({action = "openForceConsume", playerInventory = inventory, targetId = targetId})
            SetNuiFocus(true, true)
        end
    end, "player", targetId)
end)

RegisterNUICallback("player/forceconsume", function(data, cb)
    SetNuiFocus(false, false)
    TriggerServerEvent("inventory:server:forceconsume", data.targetId, data.item.slot)
    cb(true)
end)
