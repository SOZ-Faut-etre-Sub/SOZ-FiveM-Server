--
-- NUI related events
--

-- ID CARD
AddEventHandler("soz-identity:client:request-identity-data", function(target)
    TriggerServerEvent("soz-identity:server:request-data", target, "identity")
end)


-- LICENSES
AddEventHandler("soz-identity:client:request-licenses-data", function(target)
    TriggerServerEvent("soz-identity:server:request-data", target, "licenses")
end)

-- COMMON
RegisterNetEvent("soz-identity:client:show-ui", function(data)
    SendNUIMessage(data)
end)

-- HIDE ALL
AddEventHandler("soz-identity:client:hide-license", function()
    SendNUIMessage({type = "hide"})
end)
