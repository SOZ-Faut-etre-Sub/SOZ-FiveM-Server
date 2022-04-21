Fields = {}
Field = {}

function Field:new(name)
    local self = setmetatable({}, {
        __index = Field,
        __call = function(self, name)
            if Fields[name] ~= nil then
                return Fields[name]
            end
            return nil
        end,
    })

    self.name = name
    self.type = self:_parseFieldType(self.name)

    self:loadConfig(self.type)

    self.maxQuantity = math.random(self.prodRange.min, self.prodRange.max)
    self.quantity = self.maxQuantity

    Fields[self.name] = self
    return Fields[self.name]
end

Field.loadConfig = function(self, type)
    if FoodConfig.Fields[type] == nil then
        error(string.format("Invalid field type '%s'", type))
    end
    for k, v in pairs(FoodConfig.Fields[type]) do
        self[k] = v
    end
end

Field._parseFieldType = function(self, name)
    return string.match(name, "%a+")
end

Field.Harvest = function(self)
    local quantity = math.random(self.harvestRange.min, self.harvestRange.max)
    if quantity > self.quantity then
        quantity = self.quantity
    end
    self.quantity = self.quantity - quantity
    return quantity, self.item, self:GetHealth()
end

Field.GetHealth = function(self)
    return math.ceil(self.quantity * #FoodConfig.FieldHealthStates / self.maxQuantity)
end

Field.Refill = function(self, count)
    self.quantity = self.quantity + (count or 1)
    if self.quantity > self.maxQuantity then
        self.quantity = self.maxQuantity
    end
    return self.quantity
end

QBCore.Functions.CreateCallback("soz-jobs:server:get-field-health", function(source, cb, fieldName)
    local field = Fields[fieldName]
    if field ~= nil then
        cb(field:GetHealth())
    end
    cb(nil)
end)

-- Create Field objects
for fieldName, _ in pairs(FoodConfig.Zones) do
    Field:new(fieldName)
end

-- Refill loop
Citizen.CreateThread(function()
    local delay = FoodConfig.RefillLoopDelay
    while true do
        for _, field in pairs(Fields) do
            local amount = math.ceil(delay / field.refillDelay)
            field:Refill(amount)
        end
        Citizen.Wait(delay)
    end
end)
