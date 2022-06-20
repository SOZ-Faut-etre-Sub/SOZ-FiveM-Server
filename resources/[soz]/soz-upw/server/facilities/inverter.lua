Inverter = InheritsFrom(Facility)

function Inverter:new(identifier, options)
    options.type = "inverter"

    local self = Inverter:Super():new(identifier, options)

    self.fields_to_save = {"type", "capacity", "maxCapacity"}

    setmetatable(self, {__index = Inverter})

    return self
end

function Inverter:CanStoreEnergy()
    return self.capacity < self.maxCapacity
end

function Inverter:StoreEnergy()
    self.capacity = self.capacity + Config.Production.EnergyPerCell

    if self.capacity > self.maxCapacity then
        self.capacity = self.maxCapacity
    end

    return self.capacity
end
