exports("Log", function(level, message)
    TriggerServerEvent("monitor:server:Log", level, message)
end)
