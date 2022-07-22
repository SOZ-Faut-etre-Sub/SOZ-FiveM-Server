---Despawn vehicle server-side
---@param vehicleNetId number Vehicle's network ID
function DespawnVehicle(vehicleNetId)
    DeleteEntity(NetworkGetEntityFromNetworkId(vehicleNetId))
end
exports("DespawnVehicle", DespawnVehicle)
RegisterNetEvent("soz-garage:server:DespawnVehicle", DespawnVehicle)

--- Make sure model is loaded on client
function SpawnVehicle(modelName, coords, plate, fuel)
    local veh = CreateVehicle(GetHashKey(modelName), coords, true, true)

    local start = os.time()
    while not DoesEntityExist(veh) do
        if os.time() > start + 10 then
            exports["soz-monitor"]:Log("ERROR", "Vehicle spawn timed out", {model = modelName, plate = plate})
            return nil
        end
        Citizen.Wait(0)
    end

    Entity(veh).state:set("plate", plate, true)
    SetVehicleNumberPlateText(veh, plate)

    return veh
end
exports("SpawnVehicle", SpawnVehicle)
