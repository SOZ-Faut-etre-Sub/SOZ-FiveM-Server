--- @class RadioStateManager
RadioStateManager = {}

local RadioState = {}

function RadioStateManager:new()
    self.__index = self
    return setmetatable({}, self)
end

function RadioStateManager:getConsumers(channel)
    channel = tonumber(channel)
    return RadioState[channel] or {}
end

function RadioStateManager:broadcastToConsumers(channel, cb)
    channel = tonumber(channel)

    if RadioState[channel] == nil then
        RadioState[channel] = {}
    end

    for consumer, _ in pairs(RadioState[channel]) do
        cb(consumer)
    end
end

function RadioStateManager:addConsumer(source, context, channel)
    source = tonumber(source)
    channel = tonumber(channel)

    if RadioState[channel] == nil then
        RadioState[channel] = {}
    end

    RadioState[channel][source] = true
    self:broadcastToConsumers(channel, function(consumer)
        if consumer == source then
            return
        end

        TriggerClientEvent("voip:client:radio:addConsumer", consumer, context, channel, tonumber(source))
    end)
end

function RadioStateManager:removeConsumer(source, context, channel)
    source = tonumber(source)
    channel = tonumber(channel)

    if RadioState[channel] == nil then
        return
    end

    RadioState[channel][source] = nil
    self:broadcastToConsumers(channel, function(consumer)
        if consumer == source then
            return
        end

        TriggerClientEvent("voip:client:radio:removeConsumer", consumer, context, channel, source)
    end)
end

function RadioStateManager:removeConsumerFromAllChannels(source)
    source = tonumber(source)

    for channel, _ in pairs(RadioState) do
        self:removeConsumer(source, nil, channel)
    end
end

RegisterCommand("voip-debug-store", function(source, args, rawCommand)
    for channel, _ in pairs(RadioState) do
        local consumers = {}
        for consumer, _ in pairs(RadioState[channel]) do
            consumers[#consumers + 1] = tostring(consumer)
        end
        print("[Radio] Channel %s: %s", channel, json.encode(consumers))
    end
end, false)

--[[

-- TODO implemet this for FBI intervention
local RadioCheck = {}

--- Join Channel mechanism
function RadioStateManager:addChannelCheck(channel, cb)
    if channel == nil or cb == nil then
        return
    end
    channel = tonumber(channel)

    RadioCheck[channel] = cb
end

function RadioStateManager:canJoinChannel(source, channel)
    source = tonumber(source)
    channel = tonumber(channel)

    if RadioCheck[channel] then
        return RadioCheck[channel](source)
    else
        return channel == 0 or (channel >= 10000 and channel <= 99999)
    end
end

]]
