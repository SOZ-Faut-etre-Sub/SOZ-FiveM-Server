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
        FlatbedProps[VehicleId] = {Prop = NewValue, Status = false, Attached = nil}
    end
end)

RegisterServerEvent("soz-flatbed:server:getProp")
AddEventHandler("soz-flatbed:server:getProp", function(VehicleId)
    TriggerClientEvent("soz-flatbed:client:getProp", source, FlatbedProps[VehicleId])
end)

RegisterServerEvent("soz-flatbed:server:action")
AddEventHandler("soz-flatbed:server:action", function(VehicleId, Action)
    TriggerClientEvent("soz-flatbed:client:action", source, FlatbedProps[VehicleId], Action)
end)

RegisterServerEvent("soz-flatbed:server:tpaction")
AddEventHandler("soz-flatbed:server:tpaction", function(VehicleId, lastveh, entity)
    TriggerClientEvent("soz-flatbed:client:tpaction", source, FlatbedProps[VehicleId], lastveh, entity)
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
