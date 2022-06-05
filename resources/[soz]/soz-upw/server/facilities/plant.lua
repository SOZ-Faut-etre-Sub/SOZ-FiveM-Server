Plant = InheritsFrom(Facility)

function Plant:new(identifier, options)
    options.type = "plant"

    local self = Plant:Super():new(identifier, options)

    self.fields_to_save = {"type", "active", "capacity", "maxCapacity", "productionPerMinute", "pollutionPerMinute"}

    setmetatable(self, {__index = Plant})

    return self
end

--
-- ENERGY PRODUCTION
--
function Plant:CanProduce()
    return self.active and self.capacity < self.maxCapacity
end

function Plant:Produce()
    -- Energy production is altered by the waste level
    local wasteMulitplier = self:GetWasteMultiplier(self.waste)

    -- Produce energy
    local prod = self.productionPerMinute

    if type(self.productionPerMinute) == "table" then
        prod = math.random(self.productionPerMinute.min, self.productionPerMinute.max)
    end

    self.capacity = self.capacity + prod * wasteMulitplier

    -- Add pollution
    Pm:AddPollution(5)  -- TEMP Placeholder value

    -- Produce waste
    self:ProduceWaste()

    return prod
end

--
-- WASTE PRODUCTION
--
function Plant:GetWasteMultiplier(w)
    local waste = (w or self.waste) / self.maxWaste

    for wasteMultiplier, wasteRange in pairs(Config.WasteMultiplier) do
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
