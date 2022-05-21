local RadioState = RadioStateManager:new()

RegisterNetEvent("voip:server:radio:connect", function(type_, channel)
    if channel >= Config.radioFrequencies.min and channel <= Config.radioFrequencies.max then
        RadioState:addConsumer(source, channel)

        TriggerClientEvent("voip:client:radio-sr:connect", source, type_, channel, RadioState:getConsumers(channel))
    end
end)

RegisterNetEvent("voip:server:radio:disconnect", function(channel)
    RadioState:removeConsumer(source, channel)
    TriggerClientEvent("voip:client:radio-sr:disconnect", source, channel)
end)

AddEventHandler('playerDropped', function()
    RadioState:removeConsumerFromAllChannels(source)
end)
