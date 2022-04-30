local QBCore = exports["qb-core"]:GetCoreObject()
local PlayerData = QBCore.Functions.GetPlayerData()

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

RegisterNetEvent("QBCore:Client:OnPlayerUnload", function()
    PlayerData = {}
end)

--
-- NUI related events
--
-- ID CARD
AddEventHandler("soz-identity:client:request-identity-data", function(target, action)
    TriggerServerEvent("soz-identity:server:request-data", target, "identity", action)
end)

-- LICENSES
AddEventHandler("soz-identity:client:request-licenses-data", function(target, action)
    TriggerServerEvent("soz-identity:server:request-data", target, "licenses", action)
end)

-- COMMON
RegisterNetEvent("soz-identity:client:display-ui", function(data)
    local ped = PlayerPedId()

    if (data.scope == "identity") then
        Citizen.CreateThread(function()
            -- Send mugshot asynchronously as it can take a few seconds to generate
            local mugshot = exports["soz-identity"]:GetPedheadshot(ped)
            SendNUIMessage({scope = "mugshot", mugshot = GetPedheadshotTxdString(mugshot)})
        end)
    end

    if IsPedMale() then
        data.gender = "Masculin"
    else
        data.gender = "Féminin"
    end

    local job = PlayerData.job
    if job ~= nil then
        data.job = exports["soz-jobs"]:GetJobLabel(job.id)
    else
        data.job = "-"
    end

    SendNUIMessage(data)
end)

-- HIDE ALL
RegisterNetEvent("soz-identity:client:hide", function(src)
    SendNUIMessage({type = "hide", source = src})
end)

AddEventHandler("soz-identity:client:give-animation", function()
    Citizen.CreateThread(function()
        local animDict = "mp_common"
        QBCore.Functions.RequestAnimDict(animDict)
        TaskPlayAnim(PlayerPedId(), animDict, "givetake2_a", 8.0, 8.0, -1, 0, 0, true, false, true)
    end)
end)
