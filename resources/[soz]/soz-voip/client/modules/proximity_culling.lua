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
        local serverId = GetPlayerServerId(player)

        if self.serverId ~= serverId then
            local distance = #(GetEntityCoords(PlayerPedId()) - GetEntityCoords(GetPlayerPed(player)))

            if distance < 50 then
                speakers[(("player_%d"):format(serverId))] = {serverId = serverId, transmitting = true}
            end
        end
    end

    return speakers
end

function ModuleProximityCulling:getChannels()
    return {}
end

function ModuleProximityCulling:refresh()
    MumbleSetTalkerProximity(self.range)
    local voiceChannel = self.serverId + 1000

    while MumbleGetVoiceChannelFromServerId(self.serverId) ~= voiceChannel do
        NetworkSetVoiceChannel(voiceChannel)
        Citizen.Wait(0)
    end
end
