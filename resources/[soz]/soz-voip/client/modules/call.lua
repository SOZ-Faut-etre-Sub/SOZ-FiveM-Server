ModuleCall = {}

function ModuleCall:new()
    self.__index = self
    return setmetatable({callerId = nil}, self)
end

function ModuleCall:startCall(callerId)
    self.callerId = callerId
end

function ModuleCall:stopCall()
    self.callerId = nil
end

function ModuleCall:getSpeakers()
    if self.callerId == nil then
        return {}
    end

    return {[("player_%d"):format(self.callerId)] = { serverId = self.callerId }}
end
