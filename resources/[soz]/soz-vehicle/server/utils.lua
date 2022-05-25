---Despawn vehicle server-side
---@param vehicleNetId number Vehicle's network ID
function DespawnVehicle(vehicleNetId)
    DeleteEntity(NetworkGetEntityFromNetworkId(vehicleNetId))
end
exports("DespawnVehicle", DespawnVehicle)

--- Make sure model is loaded on client
function SpawnVehicle(modelName, coords, mods)
    local veh = CreateVehicle(GetHashKey(modelName), coords, true, true)
    while not DoesEntityExist(veh) do
        Citizen.Wait(0)
    end

    SetVehicleNumberPlateText(veh, mods.plate)

    -- Send event to entity owner (even if this is not the player that is spawning vehicle)
    local owner = NetworkGetEntityOwner(veh)
    local vehNetId = NetworkGetNetworkIdFromEntity(veh)
    TriggerClientEvent("soz-garage:client:SetVehicleProperties", owner, vehNetId, mods)

    return veh
end
exports("SpawnVehicle", SpawnVehicle)
