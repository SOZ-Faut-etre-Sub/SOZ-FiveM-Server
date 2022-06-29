-- CACHE pollution level client-side
local PollutionLevel = QBCore.Shared.Pollution.Level.Neutral

Citizen.CreateThread(function()
    PollutionLevel = QBCore.Functions.TriggerRpc("soz-upw:server:GetPollutionLevel")

    Citizen.Wait(15 * 60 * 1000)
end)

RegisterNetEvent("soz-upw:client:onPollutionLevelChanged", function(newPollutionLevel)
    PollutionLevel = newPollutionLevel
end)

exports("GetPollutionLevel", function()
    return PollutionLevel
end)

exports("CalculateDuration", function(baseDuration)
    return tonumber(baseDuration) * Config.Pollution.Multiplier[PollutionLevel]
end)
