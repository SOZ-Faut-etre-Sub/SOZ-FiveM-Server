FilterSubmixRegistry = {}

local function CreateRadioSubmix(name)
    local RadioSubmix = FilterSubmix:new(name, 0)

    RadioSubmix:setEffectRadioFx()
    RadioSubmix:setEffectParamInt('default', 1)
    RadioSubmix:setEffectParamFloat('freq_low', 100.0)
    RadioSubmix:setEffectParamFloat('freq_hi', 5000.0)
    RadioSubmix:setEffectParamFloat('rm_mod_freq', 300.0)
    RadioSubmix:setEffectParamFloat('rm_mix', 0.1)
    RadioSubmix:setEffectParamFloat('fudge', 50.0)
    RadioSubmix:setEffectParamFloat('o_freq_lo', 300.0)
    RadioSubmix:setEffectParamFloat('o_freq_hi', 5000.0)

    return RadioSubmix
end

PhoneSubmix = FilterSubmix:new("phone", 0)
PhoneSubmix:setEffectParamInt('default', 1)
PhoneSubmix:setEffectParamFloat('freq_low', 450.0)
PhoneSubmix:setEffectParamFloat('freq_hi', 5000.0)

RadioPrimaryLongSubmix = CreateRadioSubmix("radio_lr_primary")
RadioSecondaryLongSubmix = CreateRadioSubmix("radio_lr_secondary")
RadioPrimaryShortSubmix = CreateRadioSubmix("radio_sr_primary")
RadioSecondaryShortSubmix = CreateRadioSubmix("radio_sr_secondary")

function FilterSubmixRegistry:new()
    self.__index = self

    local registry = FilterRegistry:new()

    registry:register("radio_lr_primary", function(serverId)
        return FilterRadioSubmix:new(serverId, RadioPrimaryLongSubmix)
    end)

    registry:register("radio_lr_secondary", function(serverId)
        return FilterRadioSubmix:new(serverId, RadioSecondaryLongSubmix)
    end)

    registry:register("radio_sr_primary", function(serverId)
        return FilterRadioSubmix:new(serverId, RadioPrimaryShortSubmix)
    end)

    registry:register("radio_sr_secondary", function(serverId)
        return FilterRadioSubmix:new(serverId, RadioSecondaryShortSubmix)
    end)

    return setmetatable({registry = registry}, self)
end

function FilterSubmixRegistry:register(name, factory)
    self.factory[name] = factory
end

function FilterSubmixRegistry:connect(serverId, filterType)
    self.registry:connect(serverId, filterType)
end

function FilterSubmixRegistry:update(serverId, filterType, params)
    self.registry:update(serverId, filterType, params)
end

function FilterSubmixRegistry:disconnect(serverId)
    self.registry:disconnect(serverId)
end
