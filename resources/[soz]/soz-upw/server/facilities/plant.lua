Plant = InheritsFrom(Facility)

function Plant:new(identifier, options)
    options.type = "plant"

    local self = Plant:Super():new(identifier, options)

    setmetatable(self, {__index = Plant})

    return self
end

--
-- DATABASE
--
function Plant:Save()
    local fields = {"active", "capacity", "maxCapacity", "productionPerMinute", "pollutionPerMinute"}

    local data = {}
    for _, field in ipairs(fields) do
        data[field] = self[field]
    end

    return self:save(self.identifier, data)
end

--
-- PRODUCTION
--
function Plant:CanProduce()
    return self.active and self.capacity < self.maxCapacity
end

function Plant:Produce()
    local prod = self.productionPerMinute
    if type(self.productionPerMinute) == "table" then
        prod = math.random(self.productionPerMinute.min, self.productionPerMinute.max)
    end

    self.capacity = self.capacity + prod

    return prod
end
