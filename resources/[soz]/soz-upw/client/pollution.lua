-- CACHE pollution level client-side
local PollutionLevel = QBCore.Shared.Pollution.Level.Neutral

Citizen.CreateThread(function()
    Citizen.Wait(10 * 1000)
    PollutionLevel = QBCore.Functions.TriggerRpc("soz-upw:server:GetPollutionLevel")
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
