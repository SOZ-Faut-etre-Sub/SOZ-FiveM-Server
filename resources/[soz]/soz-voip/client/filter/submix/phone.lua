FilterPhoneSubmix = {}

function FilterPhoneSubmix:new(serverId, submix)
    self.__index = self
    return setmetatable({serverId = serverId, submix = submix}, self)
end

function FilterPhoneSubmix:connect()
    self.submix:connect(self.serverId)
end

function FilterPhoneSubmix:getType()
    return "phone"
end

function FilterPhoneSubmix:update()
end

function FilterPhoneSubmix:disconnect()
    self.submix:disconnect(self.serverId)
end
