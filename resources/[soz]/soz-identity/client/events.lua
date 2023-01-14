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
    local charinfo = PlayerData.charinfo
    local address = PlayerData.address or "-"
    local data = {
        firstName = charinfo.firstname,
        lastName = charinfo.lastname,
        job = "-",
        address = address,
        phone = charinfo.phone,
        pid = PedToNet(PlayerPedId()),
        created_at = PlayerData.metadata["arrived_in_town"] or 0,
    }

    if PlayerData.skin.Model.Hash == GetHashKey("mp_m_freemode_01") then
        data.gender = "Masculin"
    else
        data.gender = "Féminin"
    end

    local jobId = PlayerData.job.id
    if jobId ~= nil then
        data.job = exports["soz-jobs"]:GetJobLabel(jobId)
    end

    TriggerServerEvent("soz-identity:server:request-data", target, "identity", action, data)
end)

-- LICENSES
AddEventHandler("soz-identity:client:request-licenses-data", function(target, action)
    local charinfo = PlayerData.charinfo
    TriggerServerEvent("soz-identity:server:request-data", target, "licences", action, {
        firstName = charinfo.firstname,
        lastName = charinfo.lastname,
        vehicleLimit = PlayerData.metadata["vehicleLimit"],
        licences = PlayerData.metadata["licences"],
        created_at = PlayerData.metadata["arrived_in_town"] or 0,
    })
end)

-- COMMON
RegisterNetEvent("soz-identity:client:display-ui", function(data)
    SendNUIMessage(data)
    if data.scope == "identity" and data.pid then
        Citizen.CreateThread(function()
            -- Send mugshot asynchronously as it can take a few seconds to generate
            local mugshot = exports["soz-identity"]:GetPedheadshot(data.pid)
            SendNUIMessage({scope = "mugshot", mugshot = GetPedheadshotTxdString(mugshot)})
        end)
    end
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
