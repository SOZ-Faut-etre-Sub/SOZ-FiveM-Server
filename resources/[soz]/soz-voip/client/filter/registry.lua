FilterRegistry = {}

function FilterRegistry:new()
    self.__index = self

    return setmetatable({players = {}, factory = {}}, self)
end

function FilterRegistry:register(name, factory)
    self.factory[name] = factory
end

function FilterRegistry:connect(serverId, filterType)
    local key = ("player_%d"):format(serverId)

    if self.players[key] then
        self.players[key]:disconnect()
    end

    if not self.factory[filterType] then
        return
    end

    self.players[key] = self.factory[filterType](serverId)
    self.players[key]:connect()
end

function FilterRegistry:update(serverId, filterType, params)
    local key = ("player_%d"):format(serverId)

    if self.players[key] and self.players[key]:getType() ~= filterType then
        self.players[key]:disconnect()
        self.players[key] = nil
    end

    if not self.players[key] then
        if not self.factory[filterType] then
            return
        end

        self.players[key] = self.factory[filterType](serverId)
        self.players[key]:connect()
    end

    self.players[key]:update(params)
end

function FilterRegistry:disconnect(serverId)
    local key = ("player_%d"):format(serverId)

    if self.players[key] then
        self.players[key]:disconnect()
    end
end
