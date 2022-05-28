local FlatbedProps = {}

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
        print(Entity(Vehicle).state.prop )
    elseif name == "busy" then
        Entity(Vehicle).state.busy = value
    elseif name == "status" then
        Entity(Vehicle).state.status = value
    elseif name == "towedVehicle" then
        Entity(Vehicle).state.towedVehicle = value
    end
end)
