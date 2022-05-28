ModuleCall = {}

function ModuleCall:new(target, volume)
    self.__index = self
    return setmetatable({target = target, range = volume, callerId = nil}, self)
end

function ModuleCall:setVolume(volume)
    self.volume = volume
end

function ModuleCall:startCall(callerId)
    self.callerId = callerId
end

function ModuleCall:stopCall()
    self.callerId = nil
end

function ModuleCall:refresh()
    MumbleAddVoiceTargetPlayerByServerId(self.target, self.callerId)
    MumbleSetVolumeOverrideByServerId(self.callerId, self.volume)
end
