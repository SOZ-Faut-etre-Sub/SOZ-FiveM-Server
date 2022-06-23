QBCore.Functions.CreateCallback("soz:GetFeature", function(source, cb, key)
    print("Get feature: " .. key)
    cb(GetConvar("feature_" .. key, ""))
end)