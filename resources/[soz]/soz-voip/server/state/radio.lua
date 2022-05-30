--- @class RadioStateManager
RadioStateManager = {}

function RadioStateManager:new()
    self.__index = self
    return setmetatable({ state = {} }, self)
end

function RadioStateManager:getConsumers(channel)
    channel = tonumber(channel)
    return self.state[channel] or {}
end

function RadioStateManager:broadcastToConsumers(channel, cb)
    channel = tonumber(channel)

    if self.state[channel] == nil then
        self.state[channel] = {}
    end

    for consumer, contexts in pairs(self.state[channel]) do
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

    table.insert(self.state[channel][source], context)
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
