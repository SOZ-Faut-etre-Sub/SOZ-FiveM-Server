ModuleCall = {}

function ModuleCall:new()
    self.__index = self
    return setmetatable({callerId = nil, transmitting = true}, self)
end

function ModuleCall:startCall(callerId)
    self.callerId = callerId
    self.transmitting = true
end

function ModuleCall:stopCall()
    self.callerId = nil
end

function ModuleCall:setMutePlayer(callerId, state)
    if self.callerId == nil then
        return
    end

    -- Inverse the state because the event is called "setMute" but we want to know if the player is transmitting
    self.transmitting = state ~= true
end

function ModuleCall:getSpeakers()
    if self.callerId == nil then
        return {}
    end

    return {[("player_%d"):format(self.callerId)] = {serverId = self.callerId, transmitting = self.transmitting}}
end
