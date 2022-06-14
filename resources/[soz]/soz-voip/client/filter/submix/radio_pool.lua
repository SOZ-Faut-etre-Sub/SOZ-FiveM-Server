RadioPoolSubmix = {}

function RadioPoolSubmix:new(factory, limit)
    self.__index = self

    return setmetatable({factory = factory, max = limit, limit = limit, available = {}, used = {}}, self)
end

function RadioPoolSubmix:init()
    while self.limit > 0 do
        local submix = self.factory(self.max - self.limit)
        table.insert(self.available, submix)
        self.limit = self.limit - 1
        Wait(100)
    end
end

function RadioPoolSubmix:acquire(serverId)
    local id = ("player_%d"):format(serverId)

    if #self.available > 0 then
        local submix = table.remove(self.available, 1)
        self.used[id] = submix

        return submix
    end

    if self.limit <= 0 then
        print("no more radio submixes available")
        return nil
    end

    local submix = self.factory(self.limit)
    self.used[id] = submix
    self.limit = self.limit - 1

    return submix
end

function RadioPoolSubmix:release(serverId)
    local id = ("player_%d"):format(serverId)

    if not self.used[id] then
        return
    end

    table.insert(self.available, 1, self.used[id])
    self.used[id] = nil
end
