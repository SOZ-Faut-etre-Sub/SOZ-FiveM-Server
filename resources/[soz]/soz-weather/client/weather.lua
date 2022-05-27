AddStateBagChangeHandler("weather", "global", function(_, _, value, _, _)
    SetWeatherOwnedByNetwork(false)
    SetWeatherTypeOvertimePersist(value, 60.0)
end)

AddEventHandler("onClientResourceStart", function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
        return
    end

    SetWeatherOwnedByNetwork(false)
    SetWeatherTypeNowPersist(GlobalState.weather)
end)

