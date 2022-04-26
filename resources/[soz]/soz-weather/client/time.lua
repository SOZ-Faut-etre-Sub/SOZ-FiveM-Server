AddStateBagChangeHandler("time", "global", function(_, _, value, _, _)
    local hour, minute, second = table.unpack(value)
    NetworkOverrideClockTime(tonumber(hour), tonumber(minute), tonumber(second))
end)

RegisterNetEvent("onPlayerJoining", function()
    local hour, minute, second = table.unpack(GlobalState.time)
    NetworkOverrideClockTime(tonumber(hour), tonumber(minute), tonumber(second))

    SetMillisecondsPerGameMinute(2000)
end)
