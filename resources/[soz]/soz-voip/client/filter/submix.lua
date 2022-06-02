FilterSubmixRegistry = {}

local function CreateRadioSubmix(name)
    local RadioSubmix = FilterSubmix:new(name, 0)

    RadioSubmix:setEffectRadioFx()
    RadioSubmix:setEffectParamInt("default", 1)
    RadioSubmix:setEffectParamFloat("freq_low", 2000.0)
    RadioSubmix:setEffectParamFloat("freq_hi", 3000.0)
    RadioSubmix:setEffectParamFloat("fudge", 4.0)
    RadioSubmix:setEffectParamFloat("o_freq_lo", 2000.0)
    RadioSubmix:setEffectParamFloat("o_freq_hi", 3000.0)

    return RadioSubmix
end

PhoneSubmix = FilterSubmix:new("phone", 0)
PhoneSubmix:setEffectParamInt("default", 1)
PhoneSubmix:setEffectParamFloat("freq_low", 1000.0)
PhoneSubmix:setEffectParamFloat("freq_hi", 4000.0)

RadioPrimaryLongSubmix = CreateRadioSubmix("radio_lr_primary")
RadioSecondaryLongSubmix = CreateRadioSubmix("radio_lr_secondary")
RadioPrimaryShortSubmix = CreateRadioSubmix("radio_sr_primary")
RadioSecondaryShortSubmix = CreateRadioSubmix("radio_sr_secondary")

function FilterSubmixRegistry:new()
    self.__index = self

    local registry = FilterRegistry:new()
    local radioPool = RadioPoolSubmix:new(function(id)
        local name = ("radio_%s"):format(id)
        local submix = FilterSubmix:new(name, 0)

        submix:setEffectRadioFx()
        submix:setEffectParamInt("default", 1)
        submix:setEffectParamFloat("freq_low", 100.0)
        submix:setEffectParamFloat("freq_hi", 5000.0)
        submix:setEffectParamFloat("rm_mod_freq", 300.0)
        submix:setEffectParamFloat("rm_mix", 0.1)
        submix:setEffectParamFloat("fudge", 50.0)
        submix:setEffectParamFloat("o_freq_lo", 300.0)
        submix:setEffectParamFloat("o_freq_hi", 5000.0)

        return submix
    end, 39)

    registry:register("radio", function(serverId)
        return FilterRadioSubmix:new(serverId, radioPool:acquire(serverId), radioPool)
    end)

    registry:register("phone", function(serverId)
        return FilterPhoneSubmix:new(serverId, PhoneSubmix)
    end)

    return setmetatable({registry = registry}, self)
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
