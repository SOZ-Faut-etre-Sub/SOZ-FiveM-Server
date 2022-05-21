Frequency = {}

function Frequency:new(register, channel)
    self.__index = self
    return setmetatable({channel = channel, module = register, serverPlayerId = GetPlayerServerId(PlayerId()), consumers = {}}, self)
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
