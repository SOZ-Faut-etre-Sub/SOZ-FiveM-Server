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

function RadioStateManager:addConsumer(source, channel)
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

        TriggerClientEvent("voip:client:radio-sr:addConsumer", consumer, channel, source)
    end)
end

function RadioStateManager:removeConsumer(source, channel)
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

        TriggerClientEvent("voip:client:radio-sr:removeConsumer", consumer, channel, source)
    end)
end

function RadioStateManager:removeConsumerFromAllChannels(source)
    source = tonumber(source)

    for channel, _ in pairs(RadioState) do
        self:removeConsumer(source, channel)
    end
end


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
