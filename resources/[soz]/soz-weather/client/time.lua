AddStateBagChangeHandler("time", "global", function(_, _, value, _, _)
    local hour, minute, second = table.unpack(value)
    NetworkOverrideClockTime(hour, minute, second)
end)

RegisterNetEvent("onPlayerJoining", function()
    local hour, minute, second = table.unpack(GlobalState.time)
    NetworkOverrideClockTime(hour, minute, second)

    SetMillisecondsPerGameMinute(2000)
end)
