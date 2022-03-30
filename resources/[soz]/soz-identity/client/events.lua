local QBCore = exports["qb-core"]:GetCoreObject()

--
-- NUI related events
--
-- ID CARD
AddEventHandler("soz-identity:client:request-identity-data", function(target, action)
    TriggerGiveAnimation(action)
    TriggerServerEvent("soz-identity:server:request-data", target, "identity", action)
end)

-- LICENSES
AddEventHandler("soz-identity:client:request-licenses-data", function(target, action)
    TriggerGiveAnimation(action)
    TriggerServerEvent("soz-identity:server:request-data", target, "licenses", action)
end)

-- COMMON
RegisterNetEvent("soz-identity:client:display-ui", function(data)
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
RegisterNetEvent("soz-identity:client:hide", function(src)
    SendNUIMessage({type = "hide", source = src})
end)

function TriggerGiveAnimation(action)
    if action == "show" then
        Citizen.CreateThread(function()
            local animDict = "mp_common"
            QBCore.Functions.RequestAnimDict(animDict)
            TaskPlayAnim(
                PlayerPedId(), animDict, "givetake2_a",
                8.0, 8.0, -1, 0, 0, true, false, true
            )
        end)
    end
end
