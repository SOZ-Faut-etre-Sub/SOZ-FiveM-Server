ModuleRadio = {}

function ModuleRadio:new(target, volume, shortDistance, longDistance)
    self.__index = self
    return setmetatable({
        target = target,
        range = volume,
        shortDistance = shortDistance,
        longDistance = longDistance,
        frequency = nil,
        speakers = {},
    }, self)
end

function ModuleRadio:setVolume(volume)
    self.volume = volume
end

function ModuleRadio:updateFrequency(frequency)
    self.frequency = frequency
    self.speakers = {}
end

function ModuleRadio:onTransmissionStarted(frequency, serverId, coords, kind)
    local distance = #(GetEntityCoords(PlayerPedId()) - coords)

    self.speakers[serverId] = {
        coords = coords,
        kind = kind,
        distance = distance,
    }
end

function ModuleRadio:onTransmissionStopped(frequency, serverId)
    self.speakers[serverId] = nil
end

function ModuleRadio:refresh()
    for serverId, context in pairs(self.speakers) do
        local compareDistance = self.shortDistance

        if context.kind == "long" then
            compareDistance = self.longDistance
        end

        local diffDistance = self.longDistance - context.distance

        if diffDistance > 0 then
            MumbleAddVoiceTargetPlayerByServerId(self.target, serverId)
            MumbleSetVolumeOverrideByServerId(serverId, self.volume)
        end
    end
end
