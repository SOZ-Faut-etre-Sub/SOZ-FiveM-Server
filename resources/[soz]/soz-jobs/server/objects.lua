local Objects = {}

RegisterNetEvent("job:server:placeProps", function(item, props)
    local Player = QBCore.Functions.GetPlayer(source)

    if exports["soz-inventory"]:GetItem(Player.PlayerData.source, item, nil, true) >= 1 then
        exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item, 1)
        TriggerClientEvent("job:client:AddObject", Player.PlayerData.source, GetHashKey(props))
    end
end)

--- Events
RegisterNetEvent("job:server:AddObject", function(object, position)
    local obj = CreateObjectNoOffset(object, position.x, position.y, position.z, true, true, false)
    SetEntityHeading(obj, position.w or 0)
    FreezeEntityPosition(obj, true)

    Objects[NetworkGetNetworkIdFromEntity(obj)] = position
end)

RegisterNetEvent("job:server:RemoveObject", function(objNet)
    if Objects[objNet] then
        DeleteEntity(NetworkGetEntityFromNetworkId(objNet))
        Objects[objNet] = nil
    end
end)
