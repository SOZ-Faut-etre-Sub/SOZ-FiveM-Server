FilterRadioSubmix = {}

function FilterRadioSubmix:new(serverId, submix)
    self.__index = self
    return setmetatable({serverId = serverId, submix = submix}, self)
end

function FilterRadioSubmix:connect()
    self.submix:connect(self.serverId)
end

function FilterRadioSubmix:getType()
    return "radio"
end

function FilterRadioSubmix:update()
end

function FilterRadioSubmix:disconnect()
    self.submix:disconnect(self.serverId)
end
