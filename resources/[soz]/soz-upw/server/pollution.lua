local function GetPollutionLevel()
    local currentPollution = 50 -- TEMP set to Neutral level for now
    if currentPollution >= 100 then
        return QBShared.Pollution.Level.High
    end

    for level, range in pairs(QBShared.Pollution.Threshold) do
        if currentPollution >= range.min and currentPollution < range.max then
            return QBShared.Pollution.Level[level]
        end
    end
end

QBCore.Functions.CreateCallback("soz-upw:server:GetPollutionLevel", function (source, cb)
    return cb(GetPollutionLevel())
end)
