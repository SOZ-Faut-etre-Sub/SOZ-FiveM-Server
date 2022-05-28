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
AddEventHandler("soz-flatbed:server:action", function(VehicleId, Action, owner)
    TriggerClientEvent("soz-flatbed:client:action", source, FlatbedProps[VehicleId], Action, owner)
end)

RegisterServerEvent("soz-flatbed:server:tpaction")
AddEventHandler("soz-flatbed:server:tpaction", function(VehicleId, lastveh, entity, owner)
    TriggerClientEvent("soz-flatbed:client:tpaction", source, FlatbedProps[VehicleId], lastveh, entity, owner)
end)

RegisterServerEvent("soz-flatbed:server:actionowner")
AddEventHandler("soz-flatbed:server:actionowner", function(BedInfo, Action, lastVehicle, owner)
    if Action == "lower" then
        TriggerClientEvent("soz-flatbed:client:actionlower", owner, BedInfo, lastVehicle)
    elseif Action == "raise" then
        TriggerClientEvent("soz-flatbed:client:actionraise", owner, BedInfo, lastVehicle)
    elseif Action == "attach" then
        TriggerClientEvent("soz-flatbed:client:actionattach", owner, BedInfo, lastVehicle)
    elseif Action == "detach" then
        TriggerClientEvent("soz-flatbed:client:actiondettach", owner, BedInfo, lastVehicle)
    end
end)

RegisterServerEvent("soz-flatbed:server:actionownerfalse")
AddEventHandler("soz-flatbed:server:actionownerfalse", function(AttachCoords, entity, PropID, owner)
    TriggerClientEvent("soz-flatbed:client:actionownerfalse", owner, AttachCoords, entity, PropID)
end)

RegisterServerEvent("soz-flatbed:server:actionownertrue")
AddEventHandler("soz-flatbed:server:actionownertrue", function(BedInfo, lastveh, owner)
    TriggerClientEvent("soz-flatbed:client:actionownertrue", owner, BedInfo, lastveh)
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
