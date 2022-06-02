FilterChain = {}

function FilterChain:new(serverId)
    self.__index = self

    local context = GetAudiocontextForServerId(serverId)
    local source = AudiocontextGetSource(context)
    local destination = AudiocontextGetDestination(context)

    return setmetatable({context = context, source = source, destination = destination, filters = {}, freeze = false}, self)
end

function FilterChain:getContext()
    return self.context
end

function FilterChain:addFilter(filter)
    table.insert(self.filters, filter)
end

function FilterChain:connect()
    if self.freeze then
        return
    end

    self.freeze = true

    if #self.filters == 0 then
        return
    end

    -- Disconnect first
    AudiocontextDisconnect(self.context, self.destination, self.source, 0, 0)
    Wait(100)

    local currentNode = self.source

    for _, filter in pairs(self.filters) do
        local node = filter:getNode()

        AudiocontextConnect(self.context, node, currentNode, 0, 0)
        Wait(100)
        currentNode = node
    end

    AudiocontextConnect(self.context, self.destination, currentNode, 0, 0)
end

function FilterChain:disconnect()
    if #self.filters == 0 then
        return
    end

    if not self.freeze then
        return
    end

    local currentNode = self.source

    for _, filter in pairs(self.filters) do
        local node = filter:getNode()

        AudiocontextDisconnect(self.context, node, currentNode, 0, 0)
        Wait(100)
        currentNode = node
    end

    AudiocontextDisconnect(self.context, self.destination, currentNode, 0, 0)
    Wait(100)

    -- Reconnect destination and source
    AudiocontextConnect(self.context, self.destination, self.source, 0, 0)

    self.freeze = false
end

function FilterChain:delete()
    if self.freeze then
        return
    end

    if #self.filters == 0 then
        return
    end

    for _, filter in pairs(self.filters) do
        filter:delete()
    end
end
