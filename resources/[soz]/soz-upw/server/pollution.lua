QBCore.Functions.CreateCallback("soz-upw:server:GetPollutionLevel", function(source, cb)
    return cb(Pm:GetPollutionLevel())
end)
