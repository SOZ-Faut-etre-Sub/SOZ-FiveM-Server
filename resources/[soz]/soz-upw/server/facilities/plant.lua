Plant = InheritsFrom(Facility)

function Plant:new(identifier, options)
    local self = Plant:Super():new(identifier, options)

    self.fields_to_save = {
        "type",
        "active",
        "capacity",
        "maxCapacity",
        "productionPerMinute",
        "waste",
        "maxWaste",
        "wastePerMinute",
        "pollutionPerUnit",
        "zones",
    }

    setmetatable(self, {__index = Plant})

    return self
end

--
-- SETTERS
--
function Plant:ToggleActive()
    self.active = not self.active
    return self.active
end

--
-- ENERGY PRODUCTION
--
function Plant:CanProduce()
    return self.capacity < self.maxCapacity
end

function Plant:Produce()
    -- Energy production is altered by the waste level
    local wasteMulitplier = self:GetWasteMultiplier(self.waste)

    -- Produce energy
    local prod = self.productionPerMinute

    if type(self.productionPerMinute) == "table" then
        prod = math.random(self.productionPerMinute.min, self.productionPerMinute.max)
    end

    if Config.Production.HourBoost[self.identifier] then
        prod = math.ceil(prod * Config.Production.HourBoost[self.identifier])
    end

    self.capacity = self.capacity + (prod * wasteMulitplier)

    -- Add pollution
    local ppu = self.pollutionPerUnit
    if type(ppu) == "table" then
        ppu = math.random(ppu.min, ppu.max)
    end

    -- Add pollution
    Pm:AddPollution(prod * ppu)

    -- Produce waste
    self:ProduceWaste()

    return prod
end

function Plant:CanWasteBeHarvested()
    return self.waste >= Config.Production.WastePerHarvest
end

function Plant:HarvestWaste()
    self.waste = self.waste - Config.Production.WastePerHarvest

    if self.waste < 0 then
        self.waste = 0
    end

    return self.waste
end

--
-- WASTE PRODUCTION
--
function Plant:GetWasteMultiplier(w)
    local waste = (w or self.waste) / self.maxWaste

    for wasteMultiplier, range in pairs(Config.WasteMultiplier) do
        if range.max and range.min == nil and waste < range.max then
            return wasteMultiplier

        elseif range.min and range.max == nil and waste >= range.min then
            return wasteMultiplier

        elseif range.min and range.max and waste >= range.min and waste < range.max then
            return wasteMultiplier
        end
    end
end

function Plant:ProduceWaste()
    local waste = self.wastePerMinute * 0.5

    if type(self.wastePerMinute) == "table" then
        waste = math.random(self.wastePerMinute.min, self.wastePerMinute.max) * 0.5
    end

    self.waste = self.waste + waste
end
