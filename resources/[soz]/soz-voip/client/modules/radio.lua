ModuleRadio = {}

function ModuleRadio:new(distanceMax, kind)
    self.__index = self
    return setmetatable({
        distanceMax = distanceMax,
        kind = kind,
        connected = false,
        frequency = nil,
        transmitting = false,
        speakers = {},
    }, self)
end

function ModuleRadio:connect(frequency)
    if self.connected then
        self:disconnect()
    end

    self.frequency = frequency
    self.connected = true
    self.speakers = {}
end

function ModuleRadio:getFrequency()
    if self.connected then
        return self.frequency
    end

    return nil
end

function ModuleRadio:disconnect()
    if self.transmitting then
        self:stopTransmission()
    end

    self.connected = false
    self.speakers = {}
end

function ModuleRadio:startTransmission()
    if not self.connected then
        return
    end

    self.transmitting = true
    TriggerServerEvent("voip:server:radio:transmission:start", self.frequency, self.kind)
end

function ModuleRadio:stopTransmission()
    if not self.connected then
        return
    end

    self.transmitting = false
    TriggerServerEvent("voip:server:radio:transmission:stop", self.frequency)
end

function ModuleRadio:onTransmissionStarted(frequency, serverId, coords, kind)
    local distance = #(GetEntityCoords(PlayerPedId()) - coords)

    if frequency ~= self.frequency then
        return
    end

    self.speakers[serverId] = {
        coords = coords,
        kind = kind,
        distance = distance,
    }
end

function ModuleRadio:onTransmissionStopped(frequency, serverId)
    if frequency ~= self.frequency then
        return
    end

    self.speakers[serverId] = nil
end

function ModuleRadio:getSpeakers()
    local speakers = {}

    for serverId, context in pairs(self.speakers) do
        if context.kind == "long" or (context.distance < self.distanceMax) then
            speakers[serverId] = {
                distance = context.distance,
            }
        end
    end

    return speakers
end
