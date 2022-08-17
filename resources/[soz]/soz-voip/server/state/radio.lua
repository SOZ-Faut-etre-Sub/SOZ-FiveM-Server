--- @class RadioStateManager
RadioStateManager = {}

function RadioStateManager:new()
    self.__index = self
    return setmetatable({state = {}}, self)
end

function RadioStateManager:getConsumers(channel)
    channel = tonumber(channel)

    if not self.state[channel] then
        return {}
    end

    local consumers = {}

    for consumer, _ in pairs(self.state[channel]) do
        table.insert(consumers, consumer)
    end

    return consumers
end

function RadioStateManager:broadcastToConsumers(channel, cb)
    local channelNumber = tonumber(channel)

    if channelNumber == nil then
        exports["soz-monitor"]:Log("ERROR", "nil error when converting channel to number, original value: " .. channel, {})

        return
    end

    if self.state[channelNumber] == nil then
        self.state[channelNumber] = {}
    end

    for consumer, contexts in pairs(self.state[channelNumber]) do
        cb(consumer, contexts)
    end
end

function RadioStateManager:addConsumer(source, context, channel)
    source = tonumber(source)
    channel = tonumber(channel)

    if self.state[channel] == nil then
        self.state[channel] = {}
    end

    if self.state[channel][source] == nil then
        self.state[channel][source] = {}
    end

    local newContext = {}

    for _, sourceContext in pairs(self.state[channel][source]) do
        if context ~= sourceContext then
            table.insert(newContext, sourceContext)
        end
    end

    table.insert(newContext, context)

    self.state[channel][source] = newContext
end

function RadioStateManager:removeConsumer(source, context, channel)
    source = tonumber(source)
    channel = tonumber(channel)

    if self.state[channel] == nil then
        return
    end

    if self.state[channel][source] == nil then
        return
    end

    -- null context remove all context
    if context == nil then
        self.state[channel][source] = nil

        return
    end

    local newContext = {}

    for _, sourceContext in pairs(self.state[channel][source]) do
        if context ~= sourceContext then
            table.insert(newContext, sourceContext)
        end
    end

    if #newContext > 0 then
        self.state[channel][source] = newContext
    else
        self.state[channel][source] = nil
    end
end

function RadioStateManager:removeConsumerFromAllChannels(source)
    source = tonumber(source)

    for channel, _ in pairs(self.state) do
        self:removeConsumer(source, nil, channel)
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
