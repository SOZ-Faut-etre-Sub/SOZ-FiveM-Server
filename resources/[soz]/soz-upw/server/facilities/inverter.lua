Inverter = InheritsFrom(Facility)

function Inverter:new(identifier, options)
    local self = Inverter:Super():new(identifier, options)

    self.fields_to_save = {"type", "capacity", "maxCapacity", "zone"}

    self.prop = "upwpile"
    self:placeProp()

    setmetatable(self, {__index = Inverter})

    return self
end
