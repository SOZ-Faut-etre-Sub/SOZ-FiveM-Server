---Despawn vehicle server-side
---@param vehicleNetId number Vehicle's network ID
function DespawnVehicle(vehicleNetId)
    DeleteEntity(NetworkGetEntityFromNetworkId(vehicleNetId))
end
exports("DespawnVehicle", DespawnVehicle)
RegisterNetEvent("soz-garage:server:DespawnVehicle", DespawnVehicle)

--- Make sure model is loaded on client
function SpawnVehicle(modelName, coords, mods, fuel)
    local veh = CreateVehicle(GetHashKey(modelName), coords, true, true)

    local start = os.time()
    while not DoesEntityExist(veh) do
        if os.time() > start + 10 then
            exports["soz-monitor"]:Log("ERROR", "Vehicle spawn timed out", {model = modelName, plate = mods.plate})
            return nil
        end
        Citizen.Wait(0)
    end

    SetVehicleNumberPlateText(veh, mods.plate)

    -- Send event to entity owner (even if this is not the player that is spawning vehicle)
    local owner = NetworkGetEntityOwner(veh)
    local vehNetId = NetworkGetNetworkIdFromEntity(veh)
    TriggerClientEvent("soz-garage:client:SetVehicleProperties", owner, vehNetId, mods, fuel)

    return veh
end
exports("SpawnVehicle", SpawnVehicle)
