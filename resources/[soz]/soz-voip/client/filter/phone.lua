FilterPhone = {}

function FilterPhone:new(serverId)
    self.__index = self
    return setmetatable({filters = {}, connected = false}, self)
end

function FilterPhone:refresh(serverId)

end

function FilterPhone:delete()

end
