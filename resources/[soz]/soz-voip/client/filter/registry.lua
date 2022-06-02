FilterRegistry = {}

function FilterRegistry:new()
    self.__index = self

    return setmetatable({players = {}, factory = {}}, self)
end

function FilterRegistry:register(name, factory)
    self.factory[name] = factory
end

function FilterRegistry:loop(cb)
    for id, player in pairs(self.players) do
        cb(id, player)
    end
end

function FilterRegistry:apply(serverId, filterType, params)
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

        if not self.players[key] then
            return
        end

        self.players[key]:connect()
    end

    if self.players[key] then
        self.players[key]:update(params)
    end
end

function FilterRegistry:remove(serverId)
    local key = ("player_%d"):format(serverId)

    if self.players[key] then
        self.players[key]:disconnect()
        self.players[key] = nil
    end
end

function FilterRegistry:removeById(id)
    if self.players[id] then
        self.players[id]:disconnect()
        self.players[id] = nil
    end
end
