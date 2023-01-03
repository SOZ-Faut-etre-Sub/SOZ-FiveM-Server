FilterRadioSubmix = {}

function FilterRadioSubmix:new(serverId, submix, radioPool)
    self.__index = self
    return setmetatable({serverId = serverId, submix = submix, radioPool = radioPool}, self)
end

function FilterRadioSubmix:connect()
    -- set default values
    self.submix:setEffectParamInt("enabled", 1)
    self.submix:setEffectParamInt("default", 1)
    self.submix:setEffectParamFloat("fudge", 4.0)

    self.submix:connect(self.serverId)
end

function FilterRadioSubmix:getType()
    return "radio"
end

function FilterRadioSubmix:update(params)
    local volumeCorrection = 1.0

    if params.kind ~= "radio-lr" and params.distance and params.distanceMax then
        local badVoiceDistance = params.distanceMax / 3
        local leftOverDistance = badVoiceDistance - (params.distanceMax - params.distance)
        local fudge = 4.0

        if leftOverDistance > 0 then
            fudge = 4.0 + ((leftOverDistance * 56) / badVoiceDistance)
            volumeCorrection = 1.0 - ((leftOverDistance * 0.8) / badVoiceDistance)
        end

        self.submix:setEffectParamFloat("fudge", fudge)
    else
        self.submix:setEffectParamFloat("fudge", 1.5)
    end

    local volume = params.volume or 1.0

    if params.balanceLeft and params.balanceRight then
        self.submix:setBalance(volume * params.balanceLeft * volumeCorrection, volume * params.balanceRight * volumeCorrection)
    else
        self.submix:setBalance(volume * volumeCorrection, volume * volumeCorrection)
    end
end

function FilterRadioSubmix:disconnect()
    -- disable on disconnect
    self.submix:disconnect(self.serverId)
    self.submix:setEffectParamInt("enabled", 0)

    self.radioPool:release(self.serverId)
end
