FilterPhoneContext = {}

function FilterPhoneContext:new(serverId)
    self.__index = self

    local filterChain = FilterChain:new(serverId)

    filterChain:addFilter(FilterWaveShaper:new(filterChain:getContext(), 0))
    filterChain:addFilter(FilterBiquad:new(filterChain:getContext(), "highpass", {frequency = 1000.0, quality = 5.0}))
    filterChain:addFilter(FilterBiquad:new(filterChain:getContext(), "lowpass", {frequency = 4000.0, quality = 5.0}))

    return setmetatable({filterChain = filterChain}, self)
end

function FilterPhoneContext:connect()
    self.filterChain:connect()
end

function FilterPhoneContext:getType()
    return "phone"
end

function FilterPhoneContext:update()
end

function FilterPhoneContext:disconnect()
    self.filterChain:disconnect()
    self.filterChain:delete()
end
