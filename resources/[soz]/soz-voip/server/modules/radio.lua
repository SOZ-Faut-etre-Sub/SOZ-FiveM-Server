local RadioState = RadioStateManager:new()

RegisterNetEvent("voip:server:radio:connect", function(context, kind, channel)
    local connected = source

    if channel >= Config.radioFrequencies.min and channel <= Config.radioFrequencies.max then
        RadioState:broadcastToConsumers(channel, function(consumer)
            TriggerClientEvent("voip:client:radio:player:connect", consumer, context, kind, channel, connected)
        end)

        RadioState:addConsumer(connected, context, channel)
        TriggerClientEvent("voip:client:radio:connect", source, context, kind, channel, RadioState:getConsumers(channel))
    end
end)

RegisterNetEvent("voip:server:radio:disconnect", function(context, channel, kind)
    if channel == nil then
        return
    end

    local disconnected = source

    RadioState:removeConsumer(disconnected, context, channel)
    RadioState:broadcastToConsumers(channel, function(consumer)
        TriggerClientEvent("voip:client:radio:player:disconnect", consumer, context, channel, kind, disconnected)
    end)
    TriggerClientEvent("voip:client:radio:disconnect", source, context, channel, kind)
end)

AddEventHandler("playerDropped", function()
    RadioState:removeConsumerFromAllChannels(source)
end)

RegisterNetEvent("voip:server:radio:transmission:start", function(channel, kind)
    local emitter = source
    local coord = GetEntityCoords(GetPlayerPed(emitter))
    local globalState = exports["soz-core"]:GetGlobalState()

    if globalState.blackoutLevel > 1 then
        return
    end

    RadioState:broadcastToConsumers(channel, function(consumer, contexts)
        TriggerClientEvent("voip:client:radio:transmission:start", consumer, channel, emitter, coord, kind, contexts)
    end)
end)

RegisterNetEvent("voip:server:radio:transmission:stop", function(channel, kind)
    local emitter = source

    RadioState:broadcastToConsumers(channel, function(consumer, contexts)
        TriggerClientEvent("voip:client:radio:transmission:stop", consumer, channel, emitter, kind, contexts)
    end)
end)
