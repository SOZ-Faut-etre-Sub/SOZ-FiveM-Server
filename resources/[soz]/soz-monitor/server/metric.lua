
local function sendMetric(eventName, data, playerData)

end

RegisterServerEvent('monitor:server:Metric', function(eventName, data)
    local Player = QBCore.Functions.GetPlayer(source)

    sendMetric(eventName, data, Player or source)
end)

exports("Metric", sendMetric)
