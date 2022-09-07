RegisterNetEvent("soz-flatbed:server:setupstate", function(entity, name, value)
    local Vehicle = NetworkGetEntityFromNetworkId(entity)
    if name == "prop" then
        Entity(Vehicle).state.prop = value
    elseif name == "busy" then
        Entity(Vehicle).state.busy = value
    elseif name == "status" then
        Entity(Vehicle).state.status = value
    elseif name == "towedVehicle" then
        Entity(Vehicle).state.towedVehicle = value
    end
end)
