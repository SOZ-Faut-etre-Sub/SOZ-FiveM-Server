ModuleProximityCulling = {}

local megaphoneUsers = {}

Citizen.CreateThread(function()
    local players = exports["soz-core"]:GetPlayersMegaphoneInUse()

    for _, serverId in pairs(players) do
        megaphoneUsers[serverId] = true
    end
end)

AddEventHandler("soz-core:client:voip:set-megaphone", function(playerServerId, value)
    megaphoneUsers[playerServerId] = value
end)

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

    local localPlayerCoords = GetEntityCoords(PlayerPedId())
    for _, player in pairs(players) do
        local serverId = GetPlayerServerId(player)

        if self.serverId ~= serverId then
            local playerPed = GetPlayerPed(player)
            local distance = #(localPlayerCoords - GetEntityCoords(playerPed))

            local context = "proximity"
            if megaphoneUsers[serverId] then
                context = "megaphone"
            end

            if distance < 50 then
                speakers[(("player_%d"):format(serverId))] = {
                    serverId = serverId,
                    transmitting = true,
                    context = context,
                }
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
