exports("CalculateDuration", function(baseDuration)
    local pollutionLevel = QBCore.Functions.TriggerRpc("soz-upw:server:GetPollutionLevel")
    return tonumber(baseDuration) * QBCore.Shared.Pollution.Multiplier[pollutionLevel]
end)
