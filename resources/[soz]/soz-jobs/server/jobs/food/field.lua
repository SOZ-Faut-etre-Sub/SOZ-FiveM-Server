Fields = {}
Field = {}

function Field:new(name, options)
    local self = setmetatable({}, {
        __index = Field,
        __call = function(self, name)
            if Fields[name] ~= nil then
                return Fields[name]
            end
            return nil
        end,
    })
    self:loadConfig(options)

    self.name = name
    self.maxQuantity = math.random(self.prodRange.min, self.prodRange.max)
    self.quantity = self.maxQuantity

    Fields[self.name] = self
    return Fields[self.name]
end

Field.loadConfig = function(self, options)
    for k, v in pairs(options) do
        self[k] = v
    end
end

Field.Harvest = function(self)
    local quantity = math.random(self.harvestRange.min, self.harvestRange.max)
    if quantity > self.quantity then
        quantity = self.quantity
    end
    self.quantity = self.quantity - quantity
    return quantity, self:GetHealth()
end

Field.GetHealth = function(self)
    return math.ceil(self.quantity * #FoodConfig.FieldHealthStates / self.maxQuantity)
end

QBCore.Functions.CreateCallback("soz-jobs:server:get-field-health", function (source, cb, fieldName)
    local field = Fields[fieldName]
    if field ~= nil then
        cb(field:GetHealth())
    end
    cb(nil)
end)

-- Create Field objects
for fieldName, options in pairs(FoodConfig.Fields) do
    Field:new(fieldName, options)
end
