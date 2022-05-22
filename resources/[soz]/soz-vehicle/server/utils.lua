---Despawn vehicle server-side
---@param vehicleNetId number Vehicle's network ID
function DespawnVehicle(vehicleNetId)
    DeleteEntity(NetworkGetEntityFromNetworkId(vehicleNetId))
end
exports("DespawnVehicle", DespawnVehicle)
