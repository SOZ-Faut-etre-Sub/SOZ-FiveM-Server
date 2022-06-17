FilterSubmix = {}

function FilterSubmix:new(name, output)
    self.__index = self

    local submix = CreateAudioSubmix(name)
    AddAudioSubmixOutput(submix, output)

    return setmetatable({submix = submix, output = output}, self)
end

function FilterSubmix:setEffectParamInt(param, value)
    SetAudioSubmixEffectParamInt(self.submix, self.output, GetHashKey(param), value)
end

function FilterSubmix:setEffectParamFloat(param, value)
    SetAudioSubmixEffectParamFloat(self.submix, self.output, GetHashKey(param), value)
end

function FilterSubmix:setEffectRadioFx()
    SetAudioSubmixEffectRadioFx(self.submix, self.output)
end

function FilterSubmix:setBalance(left, right)
    SetAudioSubmixOutputVolumes(self.submix, 0, left, right, left, right, left, right)
end

function FilterSubmix:connect(serverId)
    MumbleSetSubmixForServerId(serverId, self.submix)
end

function FilterSubmix:disconnect(serverId)
    MumbleSetSubmixForServerId(serverId, -1)
end
