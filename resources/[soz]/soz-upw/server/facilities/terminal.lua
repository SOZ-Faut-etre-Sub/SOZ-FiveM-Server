Terminal = InheritsFrom(Facility)

function Terminal:new(identifier, options)
    local self = Terminal:Super():new(identifier, options)

    self.fields_to_save = {"type", "scope", "job", "capacity", "maxCapacity", "zone"}

    setmetatable(self, {__index = Terminal})

    return self
end

function Terminal:isGlobalScope()
    return self.scope == "default"
end

function Terminal:isJobScope()
    return self.scope == "entreprise"
end

function Terminal:CanConsume()
    return self.capacity > 0
end

function Terminal:GetEnergyPercent()
    return math.floor(self.capacity * 100 / self.maxCapacity)
end

function Terminal:GetBlackoutLevel()
    local percent = self:GetEnergyPercent()

    if percent >= 100 then
        return QBCore.Shared.Blackout.Level.Zero
    end

    for level, range in pairs(Config.Blackout.Threshold) do
        if percent >= range.min and percent < range.max then
            return level
        end
    end

    return QBCore.Shared.Blackout.Level.Zero
end

function Terminal:Consume(energy)
    self.capacity = self.capacity - energy

    if self.capacity < 0 then
        self.capacity = 0
    end

    return self.capacity
end

function Terminal:ConsumeRatio(ratio)
    self:Consume(math.floor(ratio * self.capacity))
end
