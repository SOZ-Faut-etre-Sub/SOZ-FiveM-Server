local function GetPollutionLevel()
    -- TEMP set to Neutral level for now
    return QBCore.Shared.PollutionLevel.Neutral
end

QBCore.Functions.CreateCallback("soz-upw:server:GetPollutionLevel", function (source, cb)
    return cb(GetPollutionLevel())
end)
