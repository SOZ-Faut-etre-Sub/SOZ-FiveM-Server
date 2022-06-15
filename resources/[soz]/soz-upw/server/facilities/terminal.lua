Terminal = InheritsFrom(Facility)

function Terminal:new(identifier, options)
    options.type = "terminal"

    local self = Terminal:Super():new(identifier, options)

    self.fields_to_save = {"type", "scope", "job", "capacity", "maxCapacity"}

    setmetatable(self, {__index = Terminal})

    return self
end
