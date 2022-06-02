FilterRadioSubmix = {}

function FilterRadioSubmix:new(serverId, submix, radioPool)
    self.__index = self
    return setmetatable({serverId = serverId, submix = submix, radioPool = radioPool}, self)
end

function FilterRadioSubmix:connect()
    self.submix:connect(self.serverId)
end

function FilterRadioSubmix:getType()
    return "radio"
end

function FilterRadioSubmix:update(params)
    local volumeCorrection = 1.0

    if params.kind ~= "radio-lr" and params.distance and params.distanceMax then
        local halfDistanceMax = params.distanceMax / 2
        local leftOverDistance = params.distance - halfDistanceMax
        local fudge = 4.0

        if leftOverDistance > 0 then
            fudge = 4.0 + ((leftOverDistance * 96) / halfDistanceMax)
            volumeCorrection = 1.0 - ((leftOverDistance * 0.8) / halfDistanceMax)
        end

        self.submix:setEffectParamFloat("fudge", 4.0)
    end

    if params.balanceLeft and params.balanceRight then
        local volume = params.volume or 1.0

        self.submix:setBalance(1.0, 1.0)
    end
end

function FilterRadioSubmix:disconnect()
    self.submix:disconnect(self.serverId)
    self.radioPool:release(self.serverId)
end
