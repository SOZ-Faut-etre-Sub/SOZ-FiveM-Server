ModuleProximityCulling = {}

function ModuleProximityCulling:new(range)
    self.__index = self
    return setmetatable({range = range, serverId = nil}, self)
end

function ModuleProximityCulling:init()
    self.serverId = GetPlayerServerId(PlayerId())
    MumbleSetTalkerProximity(self.range)
end

function ModuleProximityCulling:updateRange(range)
    self.range = range
    MumbleSetTalkerProximity(self.range)
end

function ModuleProximityCulling:getSpeakers()
    local players = GetActivePlayers()
    local speakers = {}

    for _, player in pairs(players) do
        -- local coords = GetEntityCoords(player) @TODO Aply effects on distance
        local serverId = GetPlayerServerId(player)

        if self.serverId ~= serverId then
            speakers[("player_%d"):format(serverId)] = {serverId = serverId}
        end
    end

    return speakers
end

function ModuleProximityCulling:getChannels()
    return {}
end

function ModuleProximityCulling:refresh()
    return
end
