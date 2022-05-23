local RadioState = RadioStateManager:new()

RegisterNetEvent("voip:server:radio:connect", function(context, type_, channel)
    if channel >= Config.radioFrequencies.min and channel <= Config.radioFrequencies.max then
        RadioState:addConsumer(source, context, channel)

        TriggerClientEvent("voip:client:radio:connect", source, context, type_, channel, RadioState:getConsumers(channel))
    end
end)

RegisterNetEvent("voip:server:radio:disconnect", function(context, channel)
    RadioState:removeConsumer(source, context, channel)
    TriggerClientEvent("voip:client:radio:disconnect", source, context, channel)
end)

RegisterNetEvent("voip:server:radio:getConsumers", function(context, channel)
    TriggerClientEvent("voip:client:radio:getConsumers", source, context, channel, RadioState:getConsumers(channel))
end)

AddEventHandler("playerDropped", function()
    RadioState:removeConsumerFromAllChannels(source)
end)
