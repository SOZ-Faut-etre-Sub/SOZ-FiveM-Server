local function GetPollutionLevel()
    local currentPollution = 50 -- TEMP set to Neutral level for now
    if currentPollution >= 100 then
        return QBCore.Shared.Pollution.Level.High
    end

    for level, range in pairs(QBCore.Shared.Pollution.Threshold) do
        if currentPollution >= range.min and currentPollution < range.max then
            return level
        end
    end
end

QBCore.Functions.CreateCallback("soz-upw:server:GetPollutionLevel", function(source, cb)
    return cb(GetPollutionLevel())
end)
