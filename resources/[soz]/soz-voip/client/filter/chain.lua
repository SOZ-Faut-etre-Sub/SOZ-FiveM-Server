FilterChain = {}

function FilterChain:new()
    self.__index = self
    return setmetatable({filters = {}}, self)
end

function FilterChain:add(filter)
    table.insert(self.filters, filter)
end

function FilterChain:update(context)
end

function FilterChain:connect(serverId)
end

function FilterChain:disconnect(serverId)
end
