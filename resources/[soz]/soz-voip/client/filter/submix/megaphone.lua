FilterMegaphoneSubmix = {}

function FilterMegaphoneSubmix:new(serverId, submix)
    self.__index = self
    return setmetatable({serverId = serverId, submix = submix}, self)
end

function FilterMegaphoneSubmix:getType()
    return "megaphone"
end

function FilterMegaphoneSubmix:update()
end

function FilterMegaphoneSubmix:connect()
    self.submix:connect(self.serverId)
end

function FilterMegaphoneSubmix:disconnect()
    self.submix:disconnect(self.serverId)
end
