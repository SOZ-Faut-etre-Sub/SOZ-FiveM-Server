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
    local data = {}

    if PlayerData.skin.Model.Hash == GetHashKey("mp_m_freemode_01") then
        data.gender = "Masculin"
    else
        data.gender = "Féminin"
    end

    local jobId = PlayerData.job.id
    if jobId ~= nil then
        data.job = exports["soz-jobs"]:GetJobLabel(jobId)
    else
        data.job = "-"
    end

    TriggerServerEvent("soz-identity:server:request-data", target, "identity", action, data)
end)

-- LICENSES
AddEventHandler("soz-identity:client:request-licenses-data", function(target, action)
    TriggerServerEvent("soz-identity:server:request-data", target, "licenses", action, {})
end)

-- COMMON
RegisterNetEvent("soz-identity:client:display-ui", function(data)
    SendNUIMessage(data)
end)

RegisterNUICallback("nui-timeout", function()
    TriggerEvent("soz-personal-menu:client:identity:resetMenu")
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
