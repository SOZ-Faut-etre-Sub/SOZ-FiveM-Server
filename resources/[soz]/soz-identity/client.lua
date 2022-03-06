--
-- NUI related events
--
AddEventHandler("soz-identity:client:request-nui-data", function(target)
    TriggerServerEvent("soz-identity:server:show-license", target)
end)

RegisterNetEvent("soz-identity:client:show-licence", function(data)
    SendNUIMessage(data)
end)

AddEventHandler("soz-identity:client:hide-license", function()
    SendNUIMessage({type = "hide"})
end)
