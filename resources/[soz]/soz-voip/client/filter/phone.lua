FilterPhone = {}

function FilterPhone:new(serverId)
    self.__index = self

    local filterChain = FilterChain:new(serverId)

    filterChain:addFilter(FilterBiquad:new(filterChain:getContext(), "highpass", {
        frequency = 500.0,
        quality = 1.0,
        gain = 0.0,
    }))
    filterChain:addFilter(FilterBiquad:new(filterChain:getContext(), "lowpass", {
        frequency = 10000.0,
        quality = 5.0,
        gain = 0.0,
    }))
    filterChain:addFilter(FilterWaveShaper:new(filterChain:getContext(), 0))

    return setmetatable({filterChain = filterChain}, self)
end

function FilterPhone:connect()
    self.filterChain:connect()
end

function FilterPhone:getType()
    return "phone"
end

function FilterPhone:update()
end

function FilterPhone:delete()
    self.filterChain:disconnect()
    self.filterChain:delete()
end
