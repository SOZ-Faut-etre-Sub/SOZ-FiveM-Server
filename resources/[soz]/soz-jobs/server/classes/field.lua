Field = {}

function Field:new(identifier, item, capacity, maxCapacity, refillDelay, harvest)
    self.__index = self

    if type(maxCapacity) == "table" then
        maxCapacity = math.random(maxCapacity.min, maxCapacity.max)
    end

    return setmetatable({
        identifier = identifier,
        item = item,
        capacity = capacity,
        maxCapacity = maxCapacity,
        refillDelay = refillDelay,
        harvest = harvest or 1,
    }, self)
end

--- Health
function Field:GetHealth()
    return math.ceil((self.capacity / self.maxCapacity) * 100)
end

function Field:GetHealthState()
    return math.ceil(self.capacity * #SozJobCore.FieldHealthStates / self.maxCapacity)
end

function Field:GetHealthIndicator()
    return SozJobCore.FieldHealthStates[self:GetHealthState()]
end

--- Refill
function Field:Refill(count)
    self.capacity = self.capacity + (count or 1)
    if self.capacity > self.maxCapacity then
        self.capacity = self.maxCapacity
    end
    return self.capacity
end

--- Harvest
function Field:Harvest()
    local min, max = self.harvest, self.harvest
    if type(self.harvest) == "table" then
        min, max = self.harvest.min, self.harvest.max
    end

    -- Production is boosted on LOW pollution level
    local pollutionLevel = exports["soz-upw"]:GetPollutionLevel()
    if pollutionLevel == QBCore.Shared.Pollution.Level.Low then
        min = min + 1
        max = max + 2
    end

    local quantity = math.random(min, max)
    if quantity > self.capacity then
        quantity = self.capacity
    end

    self.capacity = self.capacity - quantity

    return quantity, self.item, self:GetHealthState()
end

--- Loop
function Field:StartRefillLoop(delay)
    Citizen.CreateThread(function()
        while true do
            local amount = math.ceil(delay / self.refillDelay)
            self:Refill(amount)

            Citizen.Wait(delay)
        end
    end)
end
