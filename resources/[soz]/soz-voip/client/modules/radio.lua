ModuleRadio = {}

function ModuleRadio:new(distanceMax, kind, name)
    self.__index = self
    return setmetatable({
        distanceMax = distanceMax,
        kind = kind,
        connected = false,
        frequency = nil,
        transmitting = false,
        name = name,
        speakers = {},
        serverId = nil,
    }, self)
end

function ModuleRadio:init()
    self.serverId = GetPlayerServerId(PlayerId())
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

    if not self.connected then
        print(self.name, "Not starting as it's not connected")
        return
    end

    if frequency ~= self.frequency then
        print(self.name, "Not starting as frequency does not match")
        return
    end

    -- do not add self
    if self.serverId == serverId then
        print(self.name, "Not starting as same server id")
        return
    end

    print(self.name, "Start transmission")

    self.speakers[("player_%d"):format(serverId)] = {
        serverId = serverId,
        coords = coords,
        kind = kind,
        distance = distance,
    }
end

function ModuleRadio:onTransmissionStopped(frequency, serverId)
    if frequency ~= self.frequency then
        return
    end

    if self.serverId == serverId then
        return
    end

    print(self.name, "Stop transmission")

    self.speakers[("player_%d"):format(serverId)] = nil
end

function ModuleRadio:getSpeakers()
    local speakers = {}

    for _, context in pairs(self.speakers) do
        if context.kind == "long" or (context.distance < self.distanceMax) then
            speakers[("player_%d"):format(context.serverId)] = {
                serverId = context.serverId,
                distance = context.distance,
            }

            print(self.name, "Can hear !", context.kind, context.distance, self.distanceMax)
        else
            print(self.name, "Cannot hear", context.kind, context.distance, self.distanceMax)
        end
    end

    return speakers
end
