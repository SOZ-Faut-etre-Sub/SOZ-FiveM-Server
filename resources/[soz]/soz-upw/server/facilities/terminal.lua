Terminal = InheritsFrom(Facility)

function Terminal:new(identifier, options)
    local self = Terminal:Super():new(identifier, options)

    self.fields_to_save = {"type", "scope", "job", "capacity", "maxCapacity"}

    setmetatable(self, {__index = Terminal})

    return self
end

function Terminal:Consume(energy)
    self.capacity = self.capacity - energy

    if self.capacity < 0 then
        self.capacity = 0
    end

    return self.capacity
end
