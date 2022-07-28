QBCore.Functions.CreateCallback("soz-admin:feature:GetFeatures", function(source, cb, playerId)
    if not SozAdmin.Functions.IsPlayerStaff(source) then
        return
    end

    local player = QBCore.Functions.GetPlayer(playerId)

    if player then
        cb(player.PlayerData.features)
    else
        cb({})
    end
end)

RegisterNetEvent("soz-admin:feature:AddFeature", function(playerId, feature)
    if not SozAdmin.Functions.IsPlayerStaff(source) then
        return
    end

    local player = QBCore.Functions.GetPlayer(playerId)

    if not player then
        return
    end

    local newFeatures = {};

    for _, existingFeature in pairs(player.PlayerData.features or {}) do
        if existingFeature ~= feature then
            table.insert(newFeatures, existingFeature)
        end
    end

    table.insert(newFeatures, feature)

    player.Functions.SetFeatures(newFeatures)
end)

RegisterNetEvent("soz-admin:feature:RemoveFeature", function(playerId, feature)
    if not SozAdmin.Functions.IsPlayerStaff(source) then
        return
    end

    local player = QBCore.Functions.GetPlayer(playerId)

    if not player then
        return
    end

    local newFeatures = {};

    for _, existingFeature in pairs(player.PlayerData.features or {}) do
        if existingFeature ~= feature then
            table.insert(newFeatures, existingFeature)
        end
    end

    player.Functions.SetFeatures(newFeatures)
end)
