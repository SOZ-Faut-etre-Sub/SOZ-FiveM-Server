local FlatbedProps = {}

RegisterServerEvent("soz-flatbed:server:editProp")
AddEventHandler("soz-flatbed:server:editProp", function(VehicleId, ValueName, NewValue)
    if FlatbedProps[VehicleId] then
        if ValueName then
            FlatbedProps[VehicleId][ValueName] = NewValue
        else
            FlatbedProps[VehicleId] = nil
        end
    else
        FlatbedProps[VehicleId] = {Prop = NewValue}
    end
end)

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(100)

        for CurrentFlatbed, CurrentInfo in pairs(FlatbedProps) do
            if not DoesEntityExist(NetworkGetEntityFromNetworkId(CurrentFlatbed)) then
                DeleteEntity(NetworkGetEntityFromNetworkId(CurrentInfo.Prop))
                FlatbedProps[CurrentFlatbed] = nil
            end
        end
    end
end)

AddEventHandler("onResourceStop", function(ResName)
    if GetCurrentResourceName() == ResName then
        for CurrentFlatbed, CurrentInfo in pairs(FlatbedProps) do
            DeleteEntity(NetworkGetEntityFromNetworkId(CurrentInfo.Prop))
        end
    end
end)

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
