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

    if (data.scope == "identity") then
        Citizen.CreateThread(function()
            -- Send mugshot asynchronously as it can take a few seconds to generate
            local mugshot = exports["soz-identity"]:GetPedheadshot(PlayerPedId())
            SendNUIMessage({scope = "mugshot", mugshot = GetPedheadshotTxdString(mugshot)})
        end)
    end
    SendNUIMessage(data)
end)

-- HIDE ALL
AddEventHandler("soz-identity:client:hide", function()
    SendNUIMessage({type = "hide"})
end)
