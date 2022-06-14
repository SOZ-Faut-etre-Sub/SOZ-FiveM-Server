FilterSubmixRegistry = {}

PhoneSubmix = FilterSubmix:new("phone", 1)
PhoneSubmix:setEffectParamInt("default", 1)
PhoneSubmix:setEffectParamFloat("freq_low", 1000.0)
PhoneSubmix:setEffectParamFloat("freq_hi", 4000.0)

function FilterSubmixRegistry:new()
    self.__index = self

    local registry = FilterRegistry:new()
    local radioPool = RadioPoolSubmix:new(function(id)
        local name = ("radio_%s"):format(id)
        local submix = FilterSubmix:new(name, 1)

        submix:setEffectRadioFx()
        submix:setEffectParamInt("default", 1)
        submix:setEffectParamFloat("fudge", 4.0)
        submix:setEffectParamInt("enabled", 0)

        return submix
    end, 7)

    registry:register("radio", function(serverId)
        local submix = radioPool:acquire(serverId);

        if submix == nil then
            return nil
        end

        return FilterRadioSubmix:new(serverId, submix, radioPool)
    end)

    registry:register("phone", function(serverId)
        return FilterPhoneSubmix:new(serverId, PhoneSubmix)
    end)

    return setmetatable({registry = registry, radioPool = radioPool}, self)
end

function FilterSubmixRegistry:init()
    self.radioPool:init()
end

function FilterSubmixRegistry:register(name, factory)
    self.factory[name] = factory
end

function FilterSubmixRegistry:loop(cb)
    self.registry:loop(cb)
end

function FilterSubmixRegistry:apply(serverId, filterType, params)
    self.registry:apply(serverId, filterType, params)
end

function FilterSubmixRegistry:remove(serverId)
    self.registry:remove(serverId)
end

function FilterSubmixRegistry:removeById(id)
    self.registry:removeById(id)
end
