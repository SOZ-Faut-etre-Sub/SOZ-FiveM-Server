local Objects = {}

--- Items
QBCore.Functions.CreateUseableItem("cone", function(source, item)
    local Player = QBCore.Functions.GetPlayer(source)

    exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item.name, 1)
    TriggerClientEvent("job:client:AddObject", Player.PlayerData.source, GetHashKey("prop_roadcone02a"))
end)

QBCore.Functions.CreateUseableItem("police_barrier", function(source, item)
    local Player = QBCore.Functions.GetPlayer(source)

    exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item.name, 1)
    TriggerClientEvent("job:client:AddObject", Player.PlayerData.source, GetHashKey("prop_barrier_work05"))
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
