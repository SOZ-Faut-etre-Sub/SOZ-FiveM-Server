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
-- ENERGY PRODUCTION
--
function Plant:CanProduce()
    return self.active and self.capacity < self.maxCapacity
end

function Plant:Produce()
    -- Energy production is altered by the waste level
    local wasteMulitplier = self.GetWasteMultiplier(self.waste)

    -- Produce energy
    local prod = self.productionPerMinute

    if type(self.productionPerMinute) == "table" then
        prod = math.random(self.productionPerMinute.min, self.productionPerMinute.max)
    end

    self.capacity = self.capacity + prod * wasteMulitplier

    -- Produce waste
    self:ProduceWaste()

    return prod
end

--
-- WASTE PRODUCTION
--
function Plant:GetWasteMultiplier(w)
    local waste = (w or self.waste) / self.maxWaste

    for wasteMultiplier, wasteRange in pairs(self.Config.WasteMultiplier) do
        if wasteRange.min == nil and waste < wasteRange.max then
            return wasteMultiplier

        elseif wasteRange.max == nil and waste >= wasteRange.min then
            return wasteMultiplier

        elseif waste >= wasteRange.min and waste < wasteRange.max then
            return wasteMultiplier
        end
    end
end

function Plant:ProduceWaste()
    local waste = self.wastePerMinute

    if type(self.wastePerMinute) == "table" then
        waste = math.random(self.wastePerMinute.min, self.wastePerMinute.max)
    end

    self.waste = self.waste + waste
end
