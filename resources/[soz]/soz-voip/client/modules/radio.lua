ModuleRadio = {}

function ModuleRadio:new(distanceMax, kind, name, balance)
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
        balance = balance,
        balanceLeft = Config.balances[balance].left,
        balanceRight = Config.balances[balance].right,
    }, self)
end

function ModuleRadio:init()
    self.serverId = GetPlayerServerId(PlayerId())
end

function ModuleRadio:connect(frequency, consumers)
    if self.connected then
        self:disconnect()
    end

    self.frequency = frequency
    self.connected = true
    self.speakers = {}

    for _, consumer in pairs(consumers) do
        if consumer ~= self.serverId then
            self.speakers[("player_%d"):format(consumer)] = {serverId = consumer, transmitting = false}
        end
    end
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

    return self.frequency
end

function ModuleRadio:setBalance(balance)
    if not Config.balances[balance] then
        return
    end

    self.balance = balance
    self.balanceLeft = Config.balances[self.balance].left
    self.balanceRight = Config.balances[self.balance].right
end

function ModuleRadio:startTransmission()
    if not self.connected then
        return false
    end

    self.transmitting = true
    TriggerServerEvent("voip:server:radio:transmission:start", self.frequency, self.kind)

    return true
end

function ModuleRadio:stopTransmission()
    if not self.connected then
        return false
    end

    self.transmitting = false
    TriggerServerEvent("voip:server:radio:transmission:stop", self.frequency, self.kind)
    return true
end

function ModuleRadio:onPlayerConnect(frequency, serverId)
    if not self.connected then
        return false
    end

    if frequency ~= self.frequency then
        return false
    end

    -- do not add self
    if self.serverId == serverId then
        return false
    end

    self.speakers[("player_%d"):format(serverId)] = {serverId = serverId, transmitting = false}

    return true
end

function ModuleRadio:onPlayerDisconnect(frequency, serverId)
    if frequency ~= self.frequency then
        return false
    end

    if self.serverId == serverId then
        return false
    end

    if not self.speakers[("player_%d"):format(serverId)] then
        return false
    end

    self.speakers[("player_%d"):format(serverId)] = nil

    return true
end

function ModuleRadio:onTransmissionStarted(frequency, serverId, coords, kind)
    local distance = #(GetEntityCoords(PlayerPedId()) - coords)

    if not self.connected then
        return false
    end

    if frequency ~= self.frequency then
        return false
    end

    -- do not add self
    if self.serverId == serverId then
        return false
    end

    if kind ~= "radio-lr" and distance > self.distanceMax then
        return false
    end

    self.speakers[("player_%d"):format(serverId)] = {
        transmitting = true,
        serverId = serverId,
        coords = coords,
        kind = kind,
        distance = distance,
    }

    return true
end

function ModuleRadio:onTransmissionStopped(frequency, serverId)
    if frequency ~= self.frequency then
        return false
    end

    if self.serverId == serverId then
        return false
    end

    if not self.speakers[("player_%d"):format(serverId)] then
        return false
    end

    if not self.speakers[("player_%d"):format(serverId)].transmitting then
        return false
    end

    self.speakers[("player_%d"):format(serverId)].transmitting = false

    return true
end

function ModuleRadio:getSpeakers()
    local speakers = {}

    for _, context in pairs(self.speakers) do
        speakers[("player_%d"):format(context.serverId)] = {
            serverId = context.serverId,
            kind = context.kind,
            distance = context.distance,
            distanceMax = self.distanceMax,
            balanceRight = self.balanceRight,
            balanceLeft = self.balanceLeft,
            transmitting = context.transmitting and (context.kind == "radio-lr" or (context.distance < self.distanceMax)),
        }
    end

    return speakers
end
