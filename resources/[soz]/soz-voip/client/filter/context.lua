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

function FilterAudiocontextRegistry:connect(serverId, filterType)
    self.registry:connect(serverId, filterType)
end

function FilterAudiocontextRegistry:update(serverId, filterType, params)
    self.registry:update(serverId, filterType, params)
end

function FilterAudiocontextRegistry:disconnect(serverId)
    self.registry:disconnect(serverId)
end
