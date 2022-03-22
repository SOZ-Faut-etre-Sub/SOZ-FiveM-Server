--- @class CallStateManager
local CallStateManager = {}

local CallState = {}

function CallStateManager.new()
    return setmetatable({}, {__index = CallStateManager})
end

--- Player affectation
function CallStateManager:getConsumers(channel)
    channel = tonumber(channel)

    if CallState[channel] == nil then
        return {}
    end

    return CallState[channel]
end

function CallStateManager:addConsumer(source, channel)
    source = tonumber(source)
    channel = tonumber(channel)

    if CallState[channel] == nil then
        CallState[channel] = {}
    end

    CallState[channel][source] = false
end

function CallStateManager:updateConsumerState(source, channel, state)
    source = tonumber(source)
    channel = tonumber(channel)
    state = state == true

    if CallState[channel] == nil then
        return nil
    end

    CallState[channel][source] = state

    return self:getConsumers(channel)
end

function CallStateManager:removeConsumer(source, channel)
    source = tonumber(source)
    channel = tonumber(channel)

    if CallState[channel] == nil then
        CallState[channel] = {}
    end

    CallState[channel][source] = nil
end

voiceStateBackend["call"] = CallStateManager.new()
