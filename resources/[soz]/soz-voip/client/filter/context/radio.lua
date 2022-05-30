FilterRadioContext = {}

function FilterRadioContext:new(serverId)
    self.__index = self

    local filterChain = FilterChain:new(serverId)

    filterChain:addFilter(FilterBiquad:new(filterChain:getContext(), "highpass", {
        frequency = 300.0,
        quality = 1.0,
        gain = 0.0,
    }))
    filterChain:addFilter(FilterBiquad:new(filterChain:getContext(), "lowpass", {
        frequency = 3000.0,
        quality = 5.0,
        gain = 0.0,
    }))
    filterChain:addFilter(FilterBiquad:new(filterChain:getContext(), "notch", {
        frequency = 3000.0,
        quality = 0.5,
        gain = 5.0,
    }))
    filterChain:addFilter(FilterWaveShaper:new(filterChain:getContext(), 10))

    return setmetatable({filterChain = filterChain}, self)
end

function FilterRadioContext:connect()
    self.filterChain:connect()
end

function FilterRadioContext:getType()
    return "radio"
end

function FilterRadioContext:update()
end

function FilterRadioContext:disconnect()
    self.filterChain:disconnect()
    self.filterChain:delete()
end
