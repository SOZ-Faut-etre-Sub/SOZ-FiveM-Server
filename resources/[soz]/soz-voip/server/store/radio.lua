--- @class RadioStateManager
local RadioStateManager = {}

local RadioState = {}
local RadioCheck = {}

function RadioStateManager.new()
    return setmetatable({}, {__index = RadioStateManager})
end

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

--- Player affectation
function RadioStateManager:getConsumers(channel)
    channel = tonumber(channel)

    if RadioState[channel] == nil then
        return {}
    end

    return RadioState[channel]
end

function RadioStateManager:addConsumer(source, channel)
    source = tonumber(source)
    channel = tonumber(channel)

    if not RadioStateManager:canJoinChannel(source, channel) then
        return
    end

    if RadioState[channel] == nil then
        RadioState[channel] = {}
    end

    RadioState[channel][source] = false
end

function RadioStateManager:updateConsumerState(source, channel, state)
    source = tonumber(source)
    channel = tonumber(channel)
    state = state == true

    if not RadioStateManager:canJoinChannel(source, channel) then
        return
    end

    if RadioState[channel] == nil then
        return nil
    end

    RadioState[channel][source] = state

    return self:getConsumers(channel)
end

function RadioStateManager:removeConsumer(source, channel)
    source = tonumber(source)
    channel = tonumber(channel)

    if RadioState[channel] == nil then
        RadioState[channel] = {}
    end

    RadioState[channel][source] = nil
end

voiceStateBackend["radio"] = RadioStateManager.new()
