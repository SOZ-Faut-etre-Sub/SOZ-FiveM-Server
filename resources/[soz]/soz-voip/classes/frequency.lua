Frequency = {}

function Frequency:new(register, channel, extra)
    self.__index = self
    return setmetatable({
        channel = channel,
        module = register,
        extra = extra or {},
        serverPlayerId = GetPlayerServerId(PlayerId()),
        consumers = {},
    }, self)
end

function Frequency:consumerExist(serverID)
    return self.consumers[serverID] ~= nil
end

function Frequency:addConsumer(serverId)
    if not self:consumerExist(serverId) and self.serverPlayerId ~= serverId then
        self.consumers[serverId] = true
    end
end

function Frequency:removeConsumer(serverId)
    if self:consumerExist(serverId) then
        self.consumers[serverId] = nil
    end
end

--- Volume
function Frequency:getVolume()
    if self:isAvailableOnLongRange() then
        return self.extra.longRangeVolume or 1.0
    end

    return self.extra.volume or 1.0
end

function Frequency:setVolume(volume)
    if self:isAvailableOnLongRange() then
        self.extra.longRangeVolume = volume
    else
        self.extra.volume = volume
    end
end

--- Long range
function Frequency:isAvailableOnLongRange()
    return self.extra.availableOnLongRange or false
end

function Frequency:setAvailableOnLongRange(available)
    self.extra.availableOnLongRange = available
end
