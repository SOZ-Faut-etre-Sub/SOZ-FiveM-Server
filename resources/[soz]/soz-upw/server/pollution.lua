QBCore.Functions.CreateCallback("soz-upw:server:GetPollutionLevel", function(source, cb)
    return cb(Pm:GetPollutionLevel())
end)

exports("GetPollutionLevel", function()
    return Pm:GetPollutionLevel()
end)

QBCore.Functions.CreateCallback("soz-upw:server:GetPollutionPercent", function(source, cb, asString)
    local pollution = math.ceil(Pm.currentPollution * 100)

    if asString then
        return cb(string.format("%d%%", pollution))
    else
        return cb(pollution)
    end
end)

