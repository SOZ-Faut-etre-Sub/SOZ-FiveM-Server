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
