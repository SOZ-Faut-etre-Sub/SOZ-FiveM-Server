ModuleProximityCulling = {}

function ModuleProximityCulling:new(target, range)
    self.__index = self
    return setmetatable({target = target, range = range}, self)
end

function ModuleProximityCulling:init()
    MumbleSetAudioInputDistance(self.range)
end

function ModuleProximityCulling:updateRange(range)
    self.range = range
    MumbleSetAudioInputDistance(self.range)
end

function ModuleProximityCulling:refresh()
    local players = GetActivePlayers()

    for _, player in pairs(players) do
        -- local coords = GetEntityCoords(player) @TODO Aply effects on distance
        local serverId = GetPlayerServerId(player)

        MumbleAddVoiceTargetPlayerByServerId(self.target, serverId)
        MumbleSetVolumeOverrideByServerId(serverId, -1.0)
    end
end
