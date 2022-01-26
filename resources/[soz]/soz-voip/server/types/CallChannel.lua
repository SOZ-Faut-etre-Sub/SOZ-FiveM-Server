---@class CallChannel
---@field public id number
---@field public participants table<VoicePlayer>
CallChannel = {}

---new
---@return CallChannel
---@public
function CallChannel:new(id)
    local object = {}
    setmetatable(object, self)
    self.__index = self
    self.id = id
    self.participants = {}
    return self
end