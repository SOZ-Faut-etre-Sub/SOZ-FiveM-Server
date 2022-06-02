FilterAudiocontextRegistry = {}

function FilterAudiocontextRegistry:new()
    self.__index = self

    local registry = FilterRegistry:new()

    registry:register("phone", function(serverId)
        return FilterPhoneContext:new(serverId)
    end)

    registry:register("radio", function(serverId)
        return FilterRadioContext:new(serverId)
    end)

    return setmetatable({registry = registry}, self)
end

function FilterAudiocontextRegistry:register(name, factory)
    self.factory[name] = factory
end

function FilterAudiocontextRegistry:loop(cb)
    self.registry:loop(cb)
end

function FilterAudiocontextRegistry:apply(serverId, filterType, params)
    self.registry:apply(serverId, filterType, params)
end

function FilterAudiocontextRegistry:remove(serverId)
    self.registry:remove(serverId)
end

function FilterAudiocontextRegistry:removeById(id)
    self.registry:removeById(id)
end
