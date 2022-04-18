AddStateBagChangeHandler("weather", "global", function(_, _, value, _, _)
    SetWeatherOwnedByNetwork(false)
    SetWeatherTypeOvertimePersist(value, 10.0)
end)

RegisterNetEvent("onPlayerJoining", function()
    SetWeatherOwnedByNetwork(false)
    SetWeatherTypeNowPersist(GlobalState.weather)
end)

